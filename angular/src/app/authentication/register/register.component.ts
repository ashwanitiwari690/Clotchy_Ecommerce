import { ChangeDetectionStrategy, Component, computed, signal, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../auth.service';

type OtpState = 'idle' | 'sending' | 'sent' | 'verifying' | 'verified';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnDestroy {
  name = signal('');
  phone = signal('');
  password = signal('');
  confirmPassword = signal('');
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  error = signal('');
  isSubmitting = signal(false);

  otp = signal('');
  otpState = signal<OtpState>('idle');
  otpError = signal('');
  resendCooldown = signal(0);
  private cooldownTimer?: ReturnType<typeof setInterval>;

  isPhoneValid = computed(() => /^[6-9]\d{9}$/.test(this.phone()));

  constructor(private router: Router, private authService: AuthService) {}

  ngOnDestroy(): void {
    clearInterval(this.cooldownTimer);
  }

  onNameInput(e: Event): void {
    this.name.set((e.target as HTMLInputElement).value);
  }

  onPhoneKeydown(e: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End'];
    if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey) {
      return;
    }
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  }

  onPhoneInput(e: Event): void {
    const value = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 10);
    this.phone.set(value);
  }

  onOtpInput(e: Event): void {
    const value = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 4);
    this.otp.set(value);
  }

  onPasswordInput(e: Event): void {
    this.password.set((e.target as HTMLInputElement).value);
  }

  onConfirmPasswordInput(e: Event): void {
    this.confirmPassword.set((e.target as HTMLInputElement).value);
  }

  changeNumber(): void {
    this.otpState.set('idle');
    this.otp.set('');
    this.otpError.set('');
    this.resendCooldown.set(0);
    clearInterval(this.cooldownTimer);
  }

  sendOtp(): void {
    if (!this.isPhoneValid() || this.otpState() === 'sending' || this.resendCooldown() > 0) {
      return;
    }
    this.otpError.set('');
    this.otpState.set('sending');
    this.authService.sendOtp(this.phone()).subscribe({
      next: () => {
        this.otpState.set('sent');
        this.startResendCooldown();
      },
      error: (err: HttpErrorResponse) => {
        this.otpState.set('idle');
        this.otpError.set(err.error?.message ?? 'Failed to send OTP. Please try again.');
      }
    });
  }

  verifyOtp(): void {
    if (this.otp().length !== 4) {
      return;
    }
    this.otpError.set('');
    this.otpState.set('verifying');
    this.authService.verifyOtp(this.phone(), this.otp()).subscribe({
      next: () => this.otpState.set('verified'),
      error: (err: HttpErrorResponse) => {
        this.otpState.set('sent');
        this.otpError.set(err.error?.message ?? 'Incorrect OTP. Please try again.');
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

  register(): void {
    if (!this.name().trim()) {
      this.error.set('Enter your full name');
      return;
    }
    if (!this.isPhoneValid()) {
      this.error.set('Enter a valid 10-digit mobile number');
      return;
    }
    if (this.otpState() !== 'verified') {
      this.error.set('Please verify your mobile number with OTP before registering');
      return;
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(this.password())) {
      this.error.set('Password must be at least 8 characters and include an uppercase letter, a lowercase letter, and a number');
      return;
    }
    if (this.password() !== this.confirmPassword()) {
      this.error.set('Passwords do not match');
      return;
    }

    this.error.set('');
    this.isSubmitting.set(true);
    this.authService.register(this.name().trim(), this.phone(), this.password()).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (err: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this.error.set(err.error?.message ?? 'Something went wrong. Please try again.');
      }
    });
  }
}
