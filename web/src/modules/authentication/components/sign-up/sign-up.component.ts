import { Component, signal } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import {
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PASSWORD_REGEX } from '../../../../core/regex/password-regex';
import { InputComponent } from '../../../../shared/components/input/input.component';
import {
  AuthenticationService,
  TOKEN_DATA,
} from '../../../../core/services/authentication.service';
import { catchError, EMPTY, tap } from 'rxjs';
import { HotToastService } from '@ngxpert/hot-toast';
import { Router } from '@angular/router';
import { confirmPasswordValidator } from '../../../../core/validators/confirm-password.validator';

@Component({
  selector: 'app-sign-up',
  imports: [ButtonComponent, FormsModule, ReactiveFormsModule, InputComponent],
  templateUrl: './sign-up.component.html',
  styles: ``,
})
export class SignUpComponent {
  public form: FormGroup;

  public isLoading = signal(false);

  constructor(
    private readonly fb: NonNullableFormBuilder,
    private readonly authService: AuthenticationService,
    private readonly hotToastService: HotToastService,
    private readonly router: Router
  ) {
    this.form = this.fb.group({
      name: this.fb.control<string>('', [Validators.required]),
      email: this.fb.control<string>('', [
        Validators.required,
        Validators.email,
      ]),
      password: this.fb.control<string>('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
        Validators.pattern(PASSWORD_REGEX.onlyLatin.source),
        Validators.pattern(PASSWORD_REGEX.atLeastOneDigit.source),
        //TODO: add this regex when the backend is ready
        //Validators.pattern(PASSWORD_REGEX.atLeastOneUppercase.source),
        Validators.pattern(PASSWORD_REGEX.atLeastOneLowercase.source),
        Validators.pattern(PASSWORD_REGEX.atLeastOneSpecialCharacter.source),
      ]),
      confirmPassword: this.fb.control<string>('', [
        Validators.required,
        confirmPasswordValidator('password', 'confirmPassword'),
      ]),
    });
  }

  public getErrorMessage(controlName: string) {
    const control = this.form.get(controlName);

    if (!control) {
      return '';
    }

    if (control.hasError('passwordMismatch')) {
      return 'Password mismatch';
    }

    if (control.hasError('required')) {
      return 'This field is required';
    }

    if (control.hasError('email')) {
      return 'Invalid email';
    }

    if (control.hasError('minlength') || control.hasError('maxlength')) {
      return 'Password must be between 6 and 20 characters';
    }

    if (control.hasError('email')) {
      return 'Invalid email address';
    }

    if (control.hasError('pattern')) {
      const regex = control.getError('pattern')?.requiredPattern;

      if (regex === PASSWORD_REGEX.onlyLatin.source.toString()) {
        return PASSWORD_REGEX.onlyLatin.errorMessage;
      }

      if (regex === PASSWORD_REGEX.atLeastOneDigit.source.toString()) {
        return PASSWORD_REGEX.atLeastOneDigit.errorMessage;
      }

      if (regex === PASSWORD_REGEX.atLeastOneUppercase.source.toString()) {
        return PASSWORD_REGEX.atLeastOneUppercase.errorMessage;
      }

      if (regex === PASSWORD_REGEX.atLeastOneLowercase.source.toString()) {
        return PASSWORD_REGEX.atLeastOneLowercase.errorMessage;
      }

      if (
        regex === PASSWORD_REGEX.atLeastOneSpecialCharacter.source.toString()
      ) {
        return PASSWORD_REGEX.atLeastOneSpecialCharacter.errorMessage;
      }

      return regex.defaultErrorMessage;
    }

    return '';
  }

  public onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value;

      this.authService
        .signUp(formData)
        .pipe(
          tap((response) => {
            if (response?.accessToken && response?.refreshToken) {
              localStorage.setItem(TOKEN_DATA, JSON.stringify(response));
            }

            this.hotToastService.success('User was registered successfully');
            this.router.navigate(['dictionary-list']);
          }),
          catchError(() => {
            this.hotToastService.error('Error occurred trying to register');
            return EMPTY;
          })
        )
        .subscribe();
    }
  }
}
