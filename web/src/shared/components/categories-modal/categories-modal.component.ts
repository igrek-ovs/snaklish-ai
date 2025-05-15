import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AddNewCategoryRequest } from '@core/models';
import { InputComponent } from "../input/input.component";
import { tablerX } from '@ng-icons/tabler-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ButtonComponent } from "../button/button.component";

@Component({
  selector: 'app-categories-modal',
  imports: [ReactiveFormsModule, InputComponent, NgIcon, ButtonComponent],
  providers: [provideIcons({ tablerX })],
  templateUrl: './categories-modal.component.html',
})
export class CategoriesModalComponent {
  public form: FormGroup;

  constructor(
    public readonly dialogRef: DialogRef,
    @Inject(DIALOG_DATA) public readonly data: {  category: AddNewCategoryRequest, title: string },
    private readonly fb: NonNullableFormBuilder,
  ) {
    this.form = this.fb.group({
      name: this.fb.control<string>(data.category.name),
      description: this.fb.control<string>(data.category.description),
    });
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
