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
  avatar?: string | null;
  role: 'USER' | 'ADMIN';
}

interface UpdateProfileResponse {
  success: boolean;
  data: AdminUser;
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
// (POST /auth/login, GET /auth/me, POST /auth/logout). The storefront relies
// on the httpOnly session cookie, but this dashboard is deployed on a
// different domain than the API, so the cookie is a third-party cookie that
// browsers increasingly block outright regardless of SameSite. Instead the
// dashboard uses the accessToken the API also returns in the response body:
// it's kept here and attached as `Authorization: Bearer <token>` by
// CredentialsInterceptor, which the backend accepts as an alternative to the
// cookie (see auth.middleware.ts). Access to this panel is restricted to
// role=ADMIN: every login and every session check is verified against that
// role, and a non-admin account has its token cleared immediately rather
// than being left valid.
const TOKEN_STORAGE_KEY = 'clotchcy_admin_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly user = signal<AdminUser | null>(null);
  readonly isAdmin = computed(() => this.user()?.role === 'ADMIN');

  constructor(private http: HttpClient) {}

  getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }

  private clearToken(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }

  login(phone: string, password: string): Observable<AdminUser> {
    return this.http
      .post<AuthResponse>(`${environment.ECOMMERCE_API}auth/login`, { phone, password }, { withCredentials: true })
      .pipe(
        switchMap((res) => {
          this.setToken(res.data.accessToken);
          return this.assertAdmin(res.data.user);
        }),
      );
  }

  // Called by the route guard on every protected navigation: re-verifies the
  // stored token and the admin role together, so a revoked session or a role
  // downgrade takes effect on the very next navigation.
  ensureAdminSession(): Observable<AdminUser> {
    return this.http
      .get<MeResponse>(`${environment.ECOMMERCE_API}auth/me`, { withCredentials: true })
      .pipe(switchMap((res) => this.assertAdmin(res.data)));
  }

  logout(): Observable<unknown> {
    return this.http.post(`${environment.ECOMMERCE_API}auth/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.clearToken();
        this.user.set(null);
      }),
    );
  }

  clearSession(): void {
    this.clearToken();
    this.user.set(null);
  }

  // Updates the logged-in admin's own profile (name/email/avatar) and refreshes
  // the session signal so the header/sidebar reflect the change immediately.
  updateProfile(patch: { name?: string; email?: string; avatar?: string }): Observable<AdminUser> {
    return this.http
      .patch<UpdateProfileResponse>(`${environment.ECOMMERCE_API}users/me`, patch, { withCredentials: true })
      .pipe(
        switchMap((res) => {
          this.user.set({ ...this.user(), ...res.data } as AdminUser);
          return of(res.data);
        }),
      );
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
