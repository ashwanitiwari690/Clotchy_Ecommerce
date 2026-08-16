import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface AdminUser {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  role: 'USER' | 'ADMIN';
}

interface AuthResponse {
  success: boolean;
  data: { user: AdminUser; accessToken: string };
}

interface MeResponse {
  success: boolean;
  data: AdminUser;
}

// Talks to the same Node/Express backend the Clotchcy storefront uses
// (POST /auth/login, GET /auth/me, POST /auth/logout - cookie-based session,
// no separate admin API). Access to this panel is restricted to role=ADMIN:
// every login and every session check is verified against that role, and a
// non-admin account has its session cookie revoked immediately rather than
// being left valid.
@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly user = signal<AdminUser | null>(null);
  readonly isAdmin = computed(() => this.user()?.role === 'ADMIN');

  constructor(private http: HttpClient) {}

  login(phone: string, password: string): Observable<AdminUser> {
    return this.http
      .post<AuthResponse>(`${environment.ECOMMERCE_API}auth/login`, { phone, password }, { withCredentials: true })
      .pipe(switchMap((res) => this.assertAdmin(res.data.user)));
  }

  // Called by the route guard on every protected navigation: re-verifies the
  // httpOnly session cookie and the admin role together, so a revoked session
  // or a role downgrade takes effect on the very next navigation.
  ensureAdminSession(): Observable<AdminUser> {
    return this.http
      .get<MeResponse>(`${environment.ECOMMERCE_API}auth/me`, { withCredentials: true })
      .pipe(switchMap((res) => this.assertAdmin(res.data)));
  }

  logout(): Observable<unknown> {
    return this.http.post(`${environment.ECOMMERCE_API}auth/logout`, {}, { withCredentials: true }).pipe(
      tap(() => this.user.set(null)),
    );
  }

  clearSession(): void {
    this.user.set(null);
  }

  private assertAdmin(user: AdminUser): Observable<AdminUser> {
    if (user.role !== 'ADMIN') {
      return this.logout().pipe(
        switchMap(() => throwError(() => new Error('This account does not have admin access.'))),
      );
    }
    this.user.set(user);
    return of(user);
  }
}
