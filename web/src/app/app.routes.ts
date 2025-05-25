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
import { UsersListComponent } from '@src/modules/users-list/users-list.component';
import { LearnWordsComponent } from '@src/modules/learn-words/learn-words.component';
import { FaqComponent } from '@src/modules/faq/faq.component';
import { ManageCategoriesComponent } from '@src/modules/manage-categories/manage-categories.component';
import { HomeComponent } from '@src/modules/home/home.component';
import { adminGuard } from '@core/guards/admin.guard';
import { SupportComponent } from '@src/modules/support/support.component';

export const routes: Routes = [
  ...authenticationRoutes,
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: AppRoutes.Home, pathMatch: 'full' },
      { path: 'AppRoutes', component: HomeComponent },
      { path: AppRoutes.Home, component: HomeComponent },
      { path: AppRoutes.Faq, pathMatch: 'full', component: FaqComponent },
      { path: AppRoutes.DictionaryList, component: DictionaryListComponent },
      { path: AppRoutes.DictionaryList + '/:id', component: DictionaryWordComponent },
      { path: 'account', component: AcountManagementComponent },
      { path: 'profile', component: ProfileComponent },
      { path: AppRoutes.Overview, component: OverviewComponent },
      {
        path: AppRoutes.UsersList,
        component: UsersListComponent,
        canActivate: [adminGuard],
      },
      { path: AppRoutes.LearnWords, component: LearnWordsComponent },
      { path: AppRoutes.ManageCategories, component: ManageCategoriesComponent },
      { path: AppRoutes.Support, component: SupportComponent },
    ],
    canActivate: [authGuard],
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent },
];
