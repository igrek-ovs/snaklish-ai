import { Component, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import {
  AuthenticationService,
  TOKEN_DATA,
} from '../../../../core/services/authentication.service';
import { catchError, EMPTY, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { HotToastService } from '@ngxpert/hot-toast';

interface ErrorsMessages {
  required: string;
  email?: string;
  minlength?: string;
  maxlength?: string;
  pattern?: string;
  notExist?: string;
}

interface SignInFormErrors {
  email: ErrorsMessages;
  password: ErrorsMessages;
}

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './sign-in.component.html',
})
export class SignInComponent implements OnInit {
  public readonly eyeIcon: string = 'tablerEye';
  public readonly eyeOffIcon: string = 'tablerEyeOff';

  public form: FormGroup;
  public isLoading = signal(false);

  constructor(
    private readonly fb: NonNullableFormBuilder,
    private readonly router: Router,
    private readonly authenticationService: AuthenticationService,
    private readonly hotToastService: HotToastService
  ) {
    this.form = this.fb.group({
      email: this.fb.control<string>('', [
        Validators.required,
        Validators.email,
      ]),
      password: this.fb.control<string>('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.form.valueChanges.subscribe(() => {
      const passwordControl = this.form.get('password') as FormControl<string>;
      if (!passwordControl.errors) return;
      if (passwordControl.errors?.['notExist']) {
        passwordControl.setErrors({ notExist: null });
        passwordControl.updateValueAndValidity();
      }
    });
  }

  public getErrorMessage(controlName: string) {
    const control = this.form.get(controlName);

    if (control?.hasError('required')) {
      return 'required';
    } else if (control?.hasError('minlength')) {
      return 'length';
    } else if (control?.hasError('maxlength')) {
      return 'length';
    } else if (control?.hasError('invalidCredentials')) {
      return 'invalidCredentials';
    }

    return '';
  }

  public onSubmit() {
    if (this.form.valid) {
      this.hotToastService.close();

      const formData = this.form.value;
      this.authenticationService
        .login(formData)

        .pipe(
          this.hotToastService.observe({
            loading: 'Authenticating...',
            success: 'Logged in successfully',
            error: 'Invalid email or password',
          }),
          tap((response) => {
            if (response?.accessToken && response?.refreshToken) {
              localStorage.setItem(TOKEN_DATA, JSON.stringify(response));
            }

            this.router.navigate(['/dictionary-list']);
          }),
          catchError(() => {
            this.form.get('password')?.setErrors({ invalidCredentials: true });
            return EMPTY;
          })
        )
        .subscribe();
    } else {
      this.hotToastService.error(
        'Invalid email or password. Please try again.'
      );
    }
  }
}
