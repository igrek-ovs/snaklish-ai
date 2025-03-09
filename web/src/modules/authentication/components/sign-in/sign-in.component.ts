import { Component, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { PASSWORD_REGEX } from '../../../../core/regex/password-regex';

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
  public readonly eyeIcon: string = 'tablerEye';
  public readonly eyeOffIcon: string = 'tablerEyeOff';

  public form: FormGroup;
  public isLoggingIn = signal(false);
  public firstLook: boolean = true;

  constructor(
    private readonly fb: NonNullableFormBuilder,
  ) {
    this.form = this.fb.group<SignInForm>({
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
        Validators.pattern(PASSWORD_REGEX.atLeastOneUppercase.source),
        Validators.pattern(PASSWORD_REGEX.atLeastOneLowercase.source),
        Validators.pattern(PASSWORD_REGEX.atLeastOneSpecialCharacter.source),
      ]),
    });
  }

  ngOnInit() {
  }

  public getErrorMessage(controlName: string): string {
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

      if (regex === PASSWORD_REGEX.atLeastOneSpecialCharacter.source.toString()) {
        return PASSWORD_REGEX.atLeastOneSpecialCharacter.errorMessage;
      }

      return regex.defaultErrorMessage;
    }

    return '';
  }

  public onSubmit() {

  }
}
