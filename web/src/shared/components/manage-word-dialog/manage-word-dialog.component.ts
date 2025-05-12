import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { NgFor } from '@angular/common';
import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AddWordRequest, Category, EditWordRequest } from '@core/models';
import { ButtonComponent } from '../button/button.component';
import { CategoriesService } from '@core/services/categories.service';

@Component({
  selector: 'app-manage-word-dialog',
  imports: [ReactiveFormsModule, NgFor, ButtonComponent],
  templateUrl: './manage-word-dialog.component.html',
})
export class ManageWordDialogComponent implements OnInit {
  public form: FormGroup;
  public categories = signal<Category[]>([]);

  constructor(
    public readonly dialogRef: DialogRef,
    @Inject(DIALOG_DATA) public readonly data: AddWordRequest | EditWordRequest,
    private readonly fb: NonNullableFormBuilder,
    private readonly categoryService: CategoriesService,
  ) {
    this.form = this.fb.group({
      word: this.fb.control<string>(data.word),
      transcription: this.fb.control<string>(data.transcription),
      level: this.fb.control<string>(data.level),
      examples: this.fb.control<string>(data.examples),
      categoryId: this.fb.control<number>(data.categoryId),
    });
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories.set(categories);
    });
  }

  public manageWord() {
    if (this.form.valid) {
      this.dialogRef.close({
        ...this.data,
        ...this.form.getRawValue(),
      });
    }
  }
}
