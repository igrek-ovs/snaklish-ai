import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddNewCategoryRequest } from '@core/models';
import { InputComponent } from '../input/input.component';
import { tablerX } from '@ng-icons/tabler-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ButtonComponent } from '../button/button.component';
import { CATEGORY_CONSTANTS } from '@core/constants/category.constants';
import { tap } from 'rxjs';

@Component({
  selector: 'app-categories-modal',
  imports: [ReactiveFormsModule, InputComponent, NgIcon, ButtonComponent],
  providers: [provideIcons({ tablerX })],
  templateUrl: './categories-modal.component.html',
})
export class CategoriesModalComponent implements OnInit {
  public form: FormGroup;

  public readonly CategoryConstants = CATEGORY_CONSTANTS;

  constructor(
    public readonly dialogRef: DialogRef,
    @Inject(DIALOG_DATA) public readonly data: { category: AddNewCategoryRequest; title: string },
    private readonly fb: NonNullableFormBuilder
  ) {
    this.form = this.fb.group({
      name: this.fb.control<string>(data.category.name, [
        Validators.required,
        Validators.minLength(CATEGORY_CONSTANTS.nameMinLength),
        Validators.maxLength(CATEGORY_CONSTANTS.nameMaxLength),
      ]),
      description: this.fb.control<string>(data.category.description, [
        Validators.minLength(CATEGORY_CONSTANTS.descriptionMinLength),
        Validators.maxLength(CATEGORY_CONSTANTS.descriptionMaxLength),
      ]),
      toUpperCaseName: this.fb.control<boolean>(false),
    });
  }

  ngOnInit(): void {
    this.form
      .get('toUpperCaseName')!
      .valueChanges.pipe(
        tap((upper: boolean) => {
          if (upper) {
            const ctrl = this.form.get('name')!;
            const v = ctrl.value || '';

            const capitalized = v.charAt(0).toUpperCase() + v.slice(1);
            ctrl.setValue(capitalized, { emitEvent: false });
          } else {
            const ctrl = this.form.get('name')!;
            const v = ctrl.value || '';

            const capitalized = v.charAt(0).toLowerCase() + v.slice(1);
            ctrl.setValue(capitalized, { emitEvent: false });
          }
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

    if (control.hasError('minlength')) {
      return `Minimum length is ${control.getError('minlength').requiredLength} characters`;
    }

    if (control.hasError('maxlength')) {
      return `Maximum length is ${control.getError('maxlength').requiredLength} characters`;
    }

    return '';
  }

  public save() {
    if (this.form.valid) {
      this.dialogRef.close({
        ...this.data,
        ...this.form.getRawValue(),
      });
    }
  }
}
