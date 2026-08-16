import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../auth.service';

// Verifies the httpOnly session cookie against the real backend and requires
// role === 'ADMIN' on every protected navigation (app.routes.ts sets
// runGuardsAndResolvers: 'always' on this route tree), so a logged-out or
// non-admin session is caught immediately rather than only at initial login.
export const AuthGaurd: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.ensureAdminSession().pipe(
    map(() => true),
    catchError(() => of(router.parseUrl('/auth'))),
  );
};
