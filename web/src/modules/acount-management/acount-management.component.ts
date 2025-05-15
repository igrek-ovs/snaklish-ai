import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import {
//   InitialsAvatarComponent,
//   TabNavigationComponent,
//   TabNavigationItem,
// } from '../../../../shared/components';
import { CommonModule } from '@angular/common';
import { UserService } from '@core/services';
import { User } from '@core/models/user.model';

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
export class AcountManagementComponent implements OnInit {
  public user = signal<User | null>(null);
  // public tabs: TabNavigationItem[] = [
  //   { label: 'Profile', route: '/account/profile' },
  //   { label: 'Change Password', route: '/account/change-password' },
  // ];

  constructor(private readonly userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUser().subscribe((user) => {
      this.user.set(user);
    });
  }
}
