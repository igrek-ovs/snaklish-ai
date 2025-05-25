import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

export interface Category {
  id: number;
  name: string;
  description: string;
  img: string | null;
}

export interface CategorySelectResult {
  selectedIds: number[];
}

@Component({
  selector: 'app-select-categories-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ButtonComponent],
  templateUrl: './select-categories-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectCategoriesModalComponent implements OnInit {
  public form: FormGroup<{
    categories: FormArray<FormControl<boolean>>;
  }>;

  constructor(
    private readonly fb: NonNullableFormBuilder,
    public readonly dialogRef: DialogRef,
    @Inject(DIALOG_DATA)
    public readonly data: {
      title: string;
      allCategories: Category[];
      initiallySelectedIds: number[];
    }
  ) {
    const controls = data.allCategories.map((cat) =>
      this.fb.control(data.initiallySelectedIds.includes(cat.id))
    );
    this.form = this.fb.group({
      categories: this.fb.array(controls, Validators.minLength(1)),
    });
  }

  ngOnInit(): void {}

  get categoryControls() {
    return this.form.controls.categories;
  }

  public onSubmit() {
    if (this.form.valid) {
      const result: CategorySelectResult = {
        selectedIds: this.categoryControls.controls
          .map((ctrl, idx) => (ctrl.value ? this.data.allCategories[idx].id : null))
          .filter((id): id is number => id !== null),
      };

      this.dialogRef.close(result);
    }
  }
}
