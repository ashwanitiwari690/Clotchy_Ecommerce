import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminUser } from '../../core/models/admin-user.model';
import { HttpCrudStore } from '../../core/services/http-crud-store';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminUserService {
  private readonly http = inject(HttpClient);
  private readonly store = new HttpCrudStore<AdminUser>(this.http, `${environment.ECOMMERCE_API}admin-users`);

  list(): Observable<AdminUser[]> { return this.store.list(); }
  get all(): AdminUser[] { return this.store.all; }
  getById(id: string): AdminUser | undefined { return this.store.getById(id); }
  getByIdAsync(id: string): Observable<AdminUser> { return this.store.getByIdAsync(id); }
  create(data: { name: string; phone: string; email?: string; password: string }): Observable<AdminUser> {
    return this.store.create(data as unknown as Omit<AdminUser, 'id'>);
  }
  update(id: string, data: Partial<Pick<AdminUser, 'name' | 'email' | 'status'>>): Observable<AdminUser | undefined> {
    return this.store.update(id, data);
  }
}
