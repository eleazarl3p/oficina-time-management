import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

export const isLoggedInGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  if (loginService.user() === undefined) {
    loginService.getUser();

    if (!loginService.user()) {
      router.navigate(['/login']);
    }
    return true;
  }

  if (loginService.user() === null) {
    return router.navigate(['/login']);
  }
  return true;
};
