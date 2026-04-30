import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import type { UserRole } from '../models/user';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAuthenticated()) return true;
  return router.createUrlTree(['/auth/login'], { queryParams: { redirect: state.url } });
};

export const roleGuard =
  (allowedRoles: UserRole[]): CanActivateFn =>
  () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    if (!auth.isAuthenticated()) return router.createUrlTree(['/auth/login']);
    const role = auth.role();
    if (role && allowedRoles.includes(role)) return true;
    return router.createUrlTree(['/forbidden']);
  };
