import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconDirective } from '@coreui/icons-angular';
import { SharedUIModule } from '../../shared/shared-ui.module';
import { AdminUserService } from './admin-user.service';
import { AdminUser } from '../../core/models/admin-user.model';
import { AuthService } from '../authentication/auth.service';
import { ToastService } from '../../layout/toasts/toast.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [SharedUIModule, ReactiveFormsModule, IconDirective],
  templateUrl: './admin-users.component.html',
})
export class AdminUsersComponent {
  private readonly svc = inject(AdminUserService);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);
  private readonly auth = inject(AuthService);

  search = '';
  editingId = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    email: [''],
    password: [''],
  });

  get currentUserId(): string | undefined {
    return this.auth.user()?.id;
  }

  get admins(): AdminUser[] {
    const term = this.search.trim().toLowerCase();
    const list = [...this.svc.all].sort((a, b) => a.name.localeCompare(b.name));
    return term ? list.filter((a) => a.name.toLowerCase().includes(term) || a.phone.includes(term)) : list;
  }

  onSearch(value: string): void {
    this.search = value;
  }

  openAdd(): void {
    this.editingId.set(null);
    this.form.reset({ name: '', phone: '', email: '', password: '' });
    this.form.get('phone')?.enable();
    this.form.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
    this.form.get('password')?.updateValueAndValidity();
  }

  openEdit(admin: AdminUser): void {
    this.editingId.set(admin.id);
    this.form.reset({ name: admin.name, phone: admin.phone, email: admin.email ?? '', password: '' });
    this.form.get('phone')?.disable();
    this.form.get('password')?.clearValidators();
    this.form.get('password')?.updateValueAndValidity();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const id = this.editingId();
    if (id) {
      this.svc.update(id, { name: raw.name, email: raw.email || undefined }).subscribe({
        next: () => this.toast.success('Admin updated.'),
        error: (err) => this.toast.error(err.error?.message ?? 'Could not update admin.'),
      });
    } else {
      this.svc.create({ name: raw.name, phone: raw.phone, email: raw.email || undefined, password: raw.password }).subscribe({
        next: () => this.toast.success('Admin created.'),
        error: (err) => this.toast.error(err.error?.message ?? 'Could not create admin.'),
      });
    }
  }

  toggleStatus(admin: AdminUser): void {
    if (admin.id === this.currentUserId) {
      this.toast.error('You cannot deactivate your own account.');
      return;
    }
    this.svc.update(admin.id, { status: admin.status === 'active' ? 'inactive' : 'active' }).subscribe({
      error: (err) => this.toast.error(err.error?.message ?? 'Could not update admin.'),
    });
  }
}
