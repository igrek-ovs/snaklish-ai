import { Routes } from '@angular/router';
import { authenticationRoutes } from '../modules/authentication/authentication.module';
import { NotFoundComponent } from '../modules/not-found/not-found.component';
import { MainLayoutComponent } from '../modules/main-layout/main-layout.component';

export const routes: Routes = [
    ...authenticationRoutes,
    {
      path: '',
      component: MainLayoutComponent,
    },
    { path: '404', component: NotFoundComponent },
    { path: '**', component: NotFoundComponent },
  ];
  