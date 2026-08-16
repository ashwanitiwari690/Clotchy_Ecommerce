import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const AuthGaurd: CanActivateFn = (route, state) => {

  const router = inject(Router);

  if (sessionStorage.getItem('token')) {
    return true;
  }
  router.navigate(['/auth']);
  return false;
};
