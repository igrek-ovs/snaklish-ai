import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AddNewCategoryRequest } from '@core/models';
import { CategoriesService } from '@core/services/categories.service';

@Component({
  selector: 'app-categories-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './categories-modal.component.html',
})
export class CategoriesModalComponent {
  public form: FormGroup;

  constructor(
    public readonly dialogRef: DialogRef,
    @Inject(DIALOG_DATA) public readonly data: AddNewCategoryRequest,
    private readonly fb: NonNullableFormBuilder,
    private readonly categoryService: CategoriesService,
  ) {
    this.form = this.fb.group({
      name: this.fb.control<string>(data.name),
      description: this.fb.control<string>(data.description),
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
