import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  public user = signal(null); // Using signal to manage user state

  constructor(private readonly userService: UserService) {}

  ngOnInit() {
    this.userService
      .getUser()
      .pipe(
        tap((user: any) => {
          console.log('User data fetched:', user);
          this.user.set(user);
        }),
        catchError((error) => {
          console.error('Error fetching user data:', error);
          return of(null); // Return null or handle the error as needed
        })
      )
      .subscribe();
  }
}
