import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { NgFor } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AddWordRequest } from '@core/models';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-manage-word-dialog',
  imports: [ReactiveFormsModule, NgFor, ButtonComponent],
  templateUrl: './manage-word-dialog.component.html',
})
export class ManageWordDialogComponent {
  public form: FormGroup;

  constructor(
    public readonly dialogRef: DialogRef,
    @Inject(DIALOG_DATA) public readonly data: AddWordRequest,
    private readonly fb: NonNullableFormBuilder
  ) {
    this.form = this.fb.group({
      word: this.fb.control<string>(data.word),
      transcription: this.fb.control<string>(data.transcription),
      level: this.fb.control<string>(data.level),
      translation: this.fb.control<string>(data.transcription),
    });
  }
}
