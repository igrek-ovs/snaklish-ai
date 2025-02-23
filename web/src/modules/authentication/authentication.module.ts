import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';


export const authenticationRoutes: Route[] = [
  { path: 'sign-in', component: SignInComponent },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(authenticationRoutes)],
})
export class AuthenticationModule {}
