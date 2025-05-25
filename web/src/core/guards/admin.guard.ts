import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '@core/services';
import { UserRoles } from '@core/enums/user-roles.enum';
import { AppRoutes } from '@core/enums/app-routes.enum';

export const adminGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  const userRole = userService.userRole$.getValue();
  const isAdmin = userRole === UserRoles.Admin;

  if (isAdmin) {
    return true;
  }

  router.navigate([`/${AppRoutes.Support}`], {
    queryParams: {
      returnUrl: state.url,
    },
    state: {
      returnUrl: state.url,
    },
  });

  return false;
};
