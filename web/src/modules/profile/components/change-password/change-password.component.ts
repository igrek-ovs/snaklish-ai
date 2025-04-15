import { Component, signal } from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { UserService } from '../../../../core/services/user.service';
import { tap } from 'rxjs';
import { PASSWORD_REGEX } from '../../../../core/regex/password-regex';
import { confirmPasswordValidator } from '../../../../core/validators/confirm-password.validator';
import { PASSWORD_CONSTANTS } from '../../../../core/constants/password.constants';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent {
  public editMode = signal<boolean>(false);
  public passwordForm: FormGroup;

  public passwordConstants = PASSWORD_CONSTANTS;

  constructor(
    private readonly userService: UserService,
    private readonly fb: NonNullableFormBuilder,
    private readonly hotToastService: HotToastService
  ) {
    this.passwordForm = this.fb.group({
      oldPassword: fb.control('', [Validators.required]),
      newPassword: fb.control('', [
        Validators.required,
        Validators.minLength(PASSWORD_CONSTANTS.minLength),
        Validators.maxLength(PASSWORD_CONSTANTS.maxLength),
        Validators.pattern(PASSWORD_REGEX.onlyLatin.source),
        Validators.pattern(PASSWORD_REGEX.atLeastOneDigit.source),
        Validators.pattern(PASSWORD_REGEX.atLeastOneLowercase.source),
        Validators.pattern(PASSWORD_REGEX.atLeastOneSpecialCharacter.source),
      ]),
      confirmPassword: fb.control('', [
        confirmPasswordValidator('newPassword', 'confirmPassword'),
      ]),
    });
  }

  public getErrorMessage(controlName: string) {
    const control = this.passwordForm.get(controlName);

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

  public discard() {
    this.editMode.set(false);
    this.passwordForm.reset();
  }

  public onSubmit() {
    if (this.passwordForm.valid) {
      const formData = this.passwordForm.value;

      const password = formData.newPassword;

      this.userService
        .changePassword({ password })
        .pipe(
          this.hotToastService.observe({
            loading: 'Changing password...',
            success: 'Password changed successfully',
            error: 'Error changing password',
          }),
          tap(() => {
            this.editMode.set(false);
            this.passwordForm.reset();
          })
        )
        .subscribe();
    }
  }
}
