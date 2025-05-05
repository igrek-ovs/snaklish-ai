import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { AuthenticationService } from '@core/services';
import { AppRoutes } from '@core/enums/app-routes.enum';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  if (!authService.isAuthorized()) {
    return new RedirectCommand(router.parseUrl(`/${AppRoutes.SignIn}`));
  }

  return true;
};
