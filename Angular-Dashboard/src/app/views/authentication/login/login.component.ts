import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from '../auth.service';
import { ToastService } from '../../../layout/toasts/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, RouterModule, ReactiveFormsModule]
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  submitted = false;
  passwordShown = false;
  btnName = 'Sign In';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private toast: ToastService
  ) {
    this.loginForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void { }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digitsOnly = input.value.replace(/\D/g, '').slice(0, 10);
    input.value = digitsOnly;
    this.loginForm.get('phone')?.setValue(digitsOnly);
  }

  onLogin(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.btnName = 'Signing...';
    const { phone, password } = this.loginForm.value;
    this.authService.login(phone, password).subscribe({
      next: () => {
        this.toast.show('Welcome back!', 'success', 3000);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.toast.show(err?.error?.message ?? err?.message ?? 'Invalid mobile number or password', 'error', 4000);
        this.resetForm();
      }
    });
  }

  togglePass(): void {
    this.passwordShown = !this.passwordShown;
  }

  get f() {
    return this.loginForm.controls;
  }

  private resetForm(): void {
    this.btnName = 'Sign In';
    this.submitted = false;
  }

}
