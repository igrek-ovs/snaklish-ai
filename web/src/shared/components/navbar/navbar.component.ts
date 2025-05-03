import { Component, OnInit, signal } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styles: ``,
})
export class NavbarComponent implements OnInit {
  public userInitials = signal<string>('');

  constructor(private readonly userService: UserService) {}

  ngOnInit(): void {
    this.userService
      .getUser()
      .pipe(
        tap((user) => {
          const userName = user.name;
          this.userInitials.set(userName.charAt(0).toUpperCase());
        })
      )
      .subscribe();
  }

  public signOut() {
    this.userService.signOut();
  }
}
