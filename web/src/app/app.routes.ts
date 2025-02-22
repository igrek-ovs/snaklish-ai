import { Routes } from '@angular/router';
import { authenticationRoutes } from '../modules/authentication/authentication.module';

export const routes: Routes = [
    ...authenticationRoutes,
    // {
    //   path: '',
    //   loadChildren: () =>
    //     import('../modules/portal/portal.module').then((m) => m.PortalModule),
    //   component: MainLayoutComponent,
    //   canActivate: [authGuard],
    // },
    // { path: '404', component: NotFoundComponent },
    // { path: '**', component: NotFoundComponent },
  ];
  