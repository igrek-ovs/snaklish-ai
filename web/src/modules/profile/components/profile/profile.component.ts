import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { catchError, of, tap } from 'rxjs';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';

@Component({
  selector: 'app-profile',
  imports: [
    ButtonComponent,
    ReactiveFormsModule,
    InputComponent,
    ChangePasswordComponent,
  ],
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  public user = signal<any | null>(null);
  public editMode = signal<boolean>(false);
  public form: FormGroup;

  constructor(
    private readonly userService: UserService,
    private readonly fb: NonNullableFormBuilder
  ) {
    this.form = this.fb.group({
      name: [''],
      email: [''],
    });
  }

  ngOnInit() {
    this.userService
      .getUser()
      .pipe(
        tap((user) => {
          this.user.set(user);
          this.form.setValue({
            name: user?.name || '',
            email: user?.email || '',
          });
        }),
        catchError((error) => {
          console.error('Error fetching user data:', error);
          return of(null);
        })
      )
      .subscribe();
  }

  public discard() {
    this.editMode.set(false);
    this.form.setValue({
      name: this.user()?.name || '',
      email: this.user()?.email || '',
    });
  }

  public onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value;

      this.userService
        .updateUser({ ...this.user(), ...formData })
        .pipe(
          tap((user: any) => {
            this.user.set(user);
            this.editMode.set(false);
          }),
          catchError((error) => {
            console.error('Error updating user data:', error);
            return of(null);
          })
        )
        .subscribe();
    }
  }
}
