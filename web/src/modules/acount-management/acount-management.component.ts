import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import {
//   InitialsAvatarComponent,
//   TabNavigationComponent,
//   TabNavigationItem,
// } from '../../../../shared/components';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    // TabNavigationComponent,
    // InitialsAvatarComponent,
  ],
  templateUrl: './acount-management.component.html',
})
export class AcountManagementComponent {
  // public tabs: TabNavigationItem[] = [
  //   { label: 'Profile', route: '/account/profile' },
  //   { label: 'Change Password', route: '/account/change-password' },
  // ];

  constructor() {}
}
