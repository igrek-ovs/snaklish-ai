import { Component, computed, OnInit, signal } from '@angular/core';
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
import { HotToastService } from '@ngxpert/hot-toast';
import { PASSWORD_REGEX } from '../../../../core/regex/password-regex';
import { SvgComponent } from "../../../../shared/components/svg/svg.component";

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
  imports: [FormsModule, ReactiveFormsModule, InputComponent, ButtonComponent, SvgComponent],
  templateUrl: './sign-in.component.html',
})
export class SignInComponent implements OnInit {
  public form: FormGroup;
  public isLoading = signal(false);

  public atLeastEightCharacters = signal(false);
  public atMostTwentyCharacters = signal(false);
  public atLeastOneLowerCase = signal(false);
  public atLeastOneNumber = signal(false);
  public atLeastOneSpecialCharacter = signal(false);
  public passwordStrength = signal(0);

  public get validationList() {
    return [
      {
        label: 'At least 6 characters',
        isValid: this.atLeastEightCharacters(),
      },
      {
        label: 'At least one lowercase letter',
        isValid: this.atLeastOneLowerCase(),
      },
      {
        label: 'At least one digit',
        isValid: this.atLeastOneNumber(),
      },
      {
        label: 'At least one special character',
        isValid: this.atLeastOneSpecialCharacter(),
      },
    ];
  }

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
      password: this.fb.control<string>('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
        Validators.pattern(PASSWORD_REGEX.onlyLatin.source),
        Validators.pattern(PASSWORD_REGEX.atLeastOneDigit.source),
        Validators.pattern(PASSWORD_REGEX.atLeastOneLowercase.source),
        Validators.pattern(PASSWORD_REGEX.atLeastOneSpecialCharacter.source),
      ]),
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

  this.form.controls['password'].valueChanges
    .pipe(
      tap((value: string) => {
        this.atLeastEightCharacters.set(value.length >= 6);
        this.atMostTwentyCharacters.set(value.length <= 20);
        this.atLeastOneLowerCase.set(
          new RegExp(PASSWORD_REGEX.atLeastOneLowercase.source).test(value)
        );
        this.atLeastOneNumber.set(
          new RegExp(PASSWORD_REGEX.atLeastOneDigit.source).test(value)
        );
        this.atLeastOneSpecialCharacter.set(
          new RegExp(PASSWORD_REGEX.atLeastOneSpecialCharacter.source).test(value)
        );

        this.passwordStrength.set(
          (this.validationList.filter((validation) => validation.isValid).length /
          this.validationList.length) *
          100
        );
      })
    )
  .subscribe();
  }

  public getErrorMessage(controlName: string) {
    const control = this.form.get(controlName);

    if (!control) {
      return '';
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
    if (!this.form.valid) {
      return;
    }

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

          this.router.navigate(['/']);
        }),
        catchError(() => {
          this.form.get('password')?.setErrors({ invalidCredentials: true });
          return EMPTY;
        })
      )
      .subscribe();
  }
}
