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
      username: ['', [Validators.required, Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]]
    });
  }

  ngOnInit(): void { }

  onLogin(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.btnName = 'Signing...';
    this.authService.userLogin(this.loginForm.value).subscribe({
      next: (res: any) => {
        if (res?.error === 1) {
          sessionStorage.setItem('token', res.data.authkey);
          sessionStorage.setItem('username', res.data.username);
          sessionStorage.setItem('type', res.data.type);
          sessionStorage.setItem('iduser', res.data.id);
          this.toast.show(res?.message, 'success', 3000);
          this.router.navigate(['/dashboard']);
        } else {
         this.toast.show(res?.message, 'success', 3000);
          this.resetForm();
        }
      },
      error: () => {
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
    this.loginForm.reset();
    this.submitted = false;
  }
  
}
