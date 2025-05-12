import { Routes } from '@angular/router';
import { authenticationRoutes } from '../modules/authentication/authentication.module';
import { NotFoundComponent } from '../modules/not-found/not-found.component';
import { MainLayoutComponent } from '../modules/main-layout/main-layout.component';
import { DictionaryListComponent } from '../modules/dictionary-list/dictionary-list.component';
import { AcountManagementComponent } from '../modules/acount-management/acount-management.component';
import { ProfileComponent } from '../modules/profile/components/profile/profile.component';
import { OverviewComponent } from '../modules/overview/overview.component';
import { AppRoutes } from '../core/enums/app-routes.enum';
import { authGuard } from '../core/guards/auth.guard';
import { DictionaryWordComponent } from '@src/modules/dictionary-word/dictionary-word.component';

export const routes: Routes = [
  ...authenticationRoutes,
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: AppRoutes.DictionaryList, component: DictionaryListComponent },
      { path: AppRoutes.DictionaryList + '/:id', component: DictionaryWordComponent },
      { path: 'account', component: AcountManagementComponent },
      { path: 'profile', component: ProfileComponent },
      { path: AppRoutes.Overview, component: OverviewComponent },
    ],
    canActivate: [authGuard],
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent },
];
