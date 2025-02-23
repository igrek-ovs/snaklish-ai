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
// import { ButtonComponent, InputComponent } from '../../../../shared/components';
import { catchError, of, tap } from 'rxjs';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonComponent } from "../../../../shared/components/button/button.component";

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

interface SignInForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './sign-in.component.html',
})
export class SignInComponent implements OnInit {
  private readonly errorsMessages: SignInFormErrors = {
    email: {
      required: 'Email is required',
      email: 'Email is invalid',
      pattern: 'Email is invalid',
    },
    password: {
      required: 'Password is required',
      notExist: 'Email or password is incorrect',
    },
  };

  public readonly eyeIcon: string = 'tablerEye';
  public readonly eyeOffIcon: string = 'tablerEyeOff';

  public form: FormGroup;
  public isLoggingIn = signal(false);
  public firstLook: boolean = true;

  constructor(
    private readonly fb: NonNullableFormBuilder,
    private readonly router: Router,
    // private readonly hotToastService: HotToastService,
    // private readonly authService: AuthenticationService
  ) {
    this.form = this.fb.group<SignInForm>({
      email: this.fb.control<string>('', [
        Validators.required,
        Validators.email,
        // Validators.pattern(emailRegex.full),
      ]),
      password: this.fb.control<string>('', [Validators.required]),
    });

    // if (this.authService.isAuthorized) {
    //   this.router.navigate([AuthConstants.SIGNED_IN_REDIRECT_ROUTE]);
    //   return;
    // }
  }

  ngOnInit() {
    this.form.valueChanges.subscribe(() => {
      this.firstLook = false;

      const passwordControl = this.form.get('password') as FormControl<string>;
      if (!passwordControl.errors) return;
      if (passwordControl.errors?.['notExist']) {
        passwordControl.setErrors({ notExist: null });
        passwordControl.updateValueAndValidity();
      }
    });
  }

  public getErrorMessage(controlName: keyof SignInFormErrors) {
    const control = this.form.get(controlName);
    if (!control?.errors) {
      return '';
    }

    const errorKey = Object.keys(control.errors)[0] as keyof ErrorsMessages;
    const errorMessagesForControl = this.errorsMessages[controlName];

    return this.firstLook ? '' : errorMessagesForControl[errorKey];
  }

  public onSubmit() {
    // if (this.form.valid) {
    //   this.hotToastService.close();

    //   const formData: Login = { ...this.form.value };

    //   this.isLoggingIn.set(true);
    //   this.authService
    //     .login(formData)
    //     .pipe(
    //       tap((response: Auth | null) => {
    //         if (response?.token && response?.refreshToken) {
    //           const decodedToken = jwtDecode(response.token) as TokenPayload;
    //           response.rights = decodedToken.right;

    //           localStorage.setItem(tokenStorageKey, JSON.stringify(response));

    //           const localRedirect =
    //             sessionStorage.getItem(AuthConstants.LOCAL_SIGNIN_REDIRECT) ??
    //             AuthConstants.SIGNED_IN_REDIRECT_ROUTE;
    //           sessionStorage.removeItem(AuthConstants.LOCAL_SIGNIN_REDIRECT);
    //           this.router.navigate([localRedirect]);
    //         }
    //       }),
    //       catchError(() => {
    //         this.hotToastService.error('Failed to sign in');
    //         this.form.get('password')?.setErrors({ notExist: true });
    //         return of(null);
    //       }),
    //       tap(() => this.isLoggingIn.set(false))
    //     )
    //     .subscribe();
    // }
  }
}
