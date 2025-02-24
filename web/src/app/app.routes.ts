import { Routes } from '@angular/router';
import { authenticationRoutes } from '../modules/authentication/authentication.module';
import { NotFoundComponent } from '../modules/not-found/not-found.component';
import { MainLayoutComponent } from '../modules/main-layout/main-layout.component';
import { DictionaryListComponent } from '../modules/dictionary-list/dictionary-list.component';

export const routes: Routes = [
    ...authenticationRoutes,
    {
      path: '',
      component: MainLayoutComponent,
      children: [
        { path: 'dictionary-list', component: DictionaryListComponent }
      ]
    },
    { path: '404', component: NotFoundComponent },
    { path: '**', component: NotFoundComponent },
  ];
  