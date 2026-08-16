import { ChangeDetectionStrategy, Component, OnDestroy, computed, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../auth.service';

type Step = 'phone' | 'otp' | 'reset';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordComponent implements OnDestroy {
  step = signal<Step>('phone');

  // Phone
  phone = signal('');
  isPhoneValid = computed(() => /^[6-9]\d{9}$/.test(this.phone()));
  sendingOtp = signal(false);
  phoneError = signal('');
  resendCooldown = signal(0);
  private cooldownTimer?: ReturnType<typeof setInterval>;

  // OTP
  otp = signal('');
  verifyingOtp = signal(false);
  otpError = signal('');

  // Reset
  newPassword = signal('');
  confirmNewPassword = signal('');
  showNewPassword = signal(false);
  showConfirmNewPassword = signal(false);
  resetError = signal('');
  isSubmitting = signal(false);

  constructor(private router: Router, private authService: AuthService) {}

  ngOnDestroy(): void {
    clearInterval(this.cooldownTimer);
  }

  onPhoneInput(e: Event): void {
    const value = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 10);
    this.phone.set(value);
  }

  onOtpInput(e: Event): void {
    this.otp.set((e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 4));
  }

  onNewPasswordInput(e: Event): void {
    this.newPassword.set((e.target as HTMLInputElement).value);
  }

  onConfirmNewPasswordInput(e: Event): void {
    this.confirmNewPassword.set((e.target as HTMLInputElement).value);
  }

  changeNumber(): void {
    this.step.set('phone');
    this.otp.set('');
    this.otpError.set('');
    this.resendCooldown.set(0);
    clearInterval(this.cooldownTimer);
  }

  sendOtp(): void {
    if (!this.isPhoneValid() || this.sendingOtp() || this.resendCooldown() > 0) {
      return;
    }
    this.phoneError.set('');
    this.sendingOtp.set(true);
    this.authService.forgotPasswordSendOtp(this.phone()).subscribe({
      next: () => {
        this.sendingOtp.set(false);
        this.step.set('otp');
        this.startResendCooldown();
      },
      error: (err: HttpErrorResponse) => {
        this.sendingOtp.set(false);
        this.phoneError.set(err.error?.message ?? 'Failed to send OTP. Please try again.');
      }
    });
  }

  private startResendCooldown(): void {
    this.resendCooldown.set(60);
    clearInterval(this.cooldownTimer);
    this.cooldownTimer = setInterval(() => {
      this.resendCooldown.update((v) => {
        if (v <= 1) {
          clearInterval(this.cooldownTimer);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
  }

  verifyOtp(): void {
    if (this.otp().length !== 4) {
      return;
    }
    this.otpError.set('');
    this.verifyingOtp.set(true);
    this.authService.verifyOtp(this.phone(), this.otp()).subscribe({
      next: () => {
        this.verifyingOtp.set(false);
        this.step.set('reset');
      },
      error: (err: HttpErrorResponse) => {
        this.verifyingOtp.set(false);
        this.otpError.set(err.error?.message ?? 'Incorrect OTP. Please try again.');
      }
    });
  }

  resetPassword(): void {
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(this.newPassword())) {
      this.resetError.set('Password must be at least 8 characters and include an uppercase letter, a lowercase letter, and a number');
      return;
    }
    if (this.newPassword() !== this.confirmNewPassword()) {
      this.resetError.set('Passwords do not match');
      return;
    }

    this.resetError.set('');
    this.isSubmitting.set(true);
    this.authService.resetPassword(this.phone(), this.newPassword()).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (err: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this.resetError.set(err.error?.message ?? 'Something went wrong. Please try again.');
      }
    });
  }
}
