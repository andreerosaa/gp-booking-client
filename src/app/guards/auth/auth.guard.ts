import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    const userRole = authService.getUserRole();
    if (!route?.data?.roles.includes(userRole)) {
      router.navigate(['/']);
      return false;
    }
    return true;
  }

  router.navigate(['/']);
  return false;
}
