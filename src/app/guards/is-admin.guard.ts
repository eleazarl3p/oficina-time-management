import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

export const isAdminGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  // if (!loginService.user()?.isAdmin) {
  //   router.navigate(['/dashboard']);
  // }
  return true;
};
