import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  step = signal<'phone' | 'password'>('phone');
  phone = signal('');
  password = signal('');
  showPassword = signal(false);
  error = signal('');
  isSubmitting = signal(false);

  constructor(private router: Router, private authService: AuthService) {}

  onPhoneInput(e: Event): void {
    const value = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 10);
    this.phone.set(value);
  }

  onPasswordInput(e: Event): void {
    this.password.set((e.target as HTMLInputElement).value);
  }

  submitPhone(): void {
    if (!/^[6-9]\d{9}$/.test(this.phone())) {
      this.error.set('Enter a valid 10-digit mobile number');
      return;
    }
    this.error.set('');
    this.step.set('password');
  }

  changeNumber(): void {
    this.step.set('phone');
    this.password.set('');
    this.error.set('');
  }

  login(): void {
    if (!this.password()) {
      this.error.set('Enter your password');
      return;
    }
    this.error.set('');
    this.isSubmitting.set(true);
    this.authService.login(this.phone(), this.password()).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (err: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this.error.set(err.error?.message ?? 'Something went wrong. Please try again.');
      }
    });
  }
}
