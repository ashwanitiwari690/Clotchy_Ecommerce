import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  role: 'USER' | 'ADMIN';
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface AuthResponse {
  success: boolean;
  data: { user: AuthUser; accessToken: string };
}

interface MeResponse {
  success: boolean;
  data: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly user = signal<AuthUser | null>(null);
  readonly isAuthenticated = computed(() => this.user() !== null);

  constructor(private http: HttpClient) {}

  sendOtp(phone: string): Observable<{ success: boolean; data: { message: string } }> {
    return this.http.post<{ success: boolean; data: { message: string } }>(
      `${environment.apiUrl}/auth/send-otp`,
      { phone },
    );
  }

  verifyOtp(phone: string, otp: string): Observable<{ success: boolean; data: { verified: boolean } }> {
    return this.http.post<{ success: boolean; data: { verified: boolean } }>(
      `${environment.apiUrl}/auth/verify-otp`,
      { phone, otp },
    );
  }

  register(name: string, phone: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/register`, { name, phone, password }, { withCredentials: true })
      .pipe(tap((res) => this.user.set(res.data.user)));
  }

  login(phone: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, { phone, password }, { withCredentials: true })
      .pipe(tap((res) => this.user.set(res.data.user)));
  }

  restoreSession(): Observable<MeResponse> {
    return this.http
      .get<MeResponse>(`${environment.apiUrl}/auth/me`, { withCredentials: true })
      .pipe(tap((res) => this.user.set(res.data)));
  }

  logout(): Observable<unknown> {
    return this.http.post(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true }).pipe(
      tap(() => this.user.set(null)),
    );
  }

  clearSession(): void {
    this.user.set(null);
  }

  updateProfile(name: string, email: string): Observable<{ success: boolean; data: AuthUser }> {
    return this.http
      .patch<{ success: boolean; data: AuthUser }>(
        `${environment.apiUrl}/users/me`,
        { name, email },
        { withCredentials: true },
      )
      .pipe(tap((res) => this.user.set(res.data)));
  }

  getAddress(): Observable<{ success: boolean; data: Address | null }> {
    return this.http.get<{ success: boolean; data: Address | null }>(
      `${environment.apiUrl}/users/me/address`,
      { withCredentials: true },
    );
  }

  saveAddress(address: Omit<Address, 'id'>): Observable<{ success: boolean; data: Address }> {
    return this.http.put<{ success: boolean; data: Address }>(
      `${environment.apiUrl}/users/me/address`,
      address,
      { withCredentials: true },
    );
  }

  forgotPasswordSendOtp(phone: string): Observable<{ success: boolean; data: { message: string } }> {
    return this.http.post<{ success: boolean; data: { message: string } }>(
      `${environment.apiUrl}/auth/forgot-password/send-otp`,
      { phone },
    );
  }

  resetPassword(phone: string, newPassword: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${environment.apiUrl}/auth/reset-password`,
        { phone, newPassword },
        { withCredentials: true },
      )
      .pipe(tap((res) => this.user.set(res.data.user)));
  }
}
