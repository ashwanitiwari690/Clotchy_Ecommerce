import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

// Blocks pages that require a logged-in user (e.g. /profile) - sends anonymous
// visitors to /login instead.
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isAuthenticated() ? true : router.parseUrl('/login');
};

// Blocks pages meant only for logged-out visitors (login/register) - stops an
// already-authenticated user from reaching them by pasting the URL directly.
export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isAuthenticated() ? router.parseUrl('/profile') : true;
};
