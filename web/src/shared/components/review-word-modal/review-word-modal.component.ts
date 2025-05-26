import { Component, Inject, OnInit, signal } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { InputComponent } from '../input/input.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { CommonModule } from '@angular/common';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Word } from '@core/models';
import { tablerX } from '@ng-icons/tabler-icons';
import { LocaleService } from '@core/services';

@Component({
  selector: 'app-review-word-modal',
  imports: [ReactiveFormsModule, CommonModule, ButtonComponent, NgIcon, InputComponent],
  providers: [provideIcons({ tablerX })],
  templateUrl: './review-word-modal.component.html',
})
export class ReviewWordModalComponent implements OnInit {
  public form: FormGroup;

  public localeCode = signal<string>('en');

  constructor(
    private readonly localeService: LocaleService,
    private readonly fb: NonNullableFormBuilder,
    public readonly dialogRef: DialogRef,
    @Inject(DIALOG_DATA)
    public readonly data: {
      title: string;
      word: Word;
    }
  ) {
    this.form = this.fb.group({
      word: this.fb.control<string>(data.word.word),
      wordTranslation: this.fb.control<string>(''),
    });
  }

  ngOnInit(): void {
    this.localeService.locale$.subscribe((code) => {
      this.localeCode.set(code);
    });
  }

  public onSubmit() {
    if (this.form.valid) {
      const locale = this.localeService.convertLocaleToBackend(this.localeCode());
      const { translation } = this.data.word.translations.find((tr) => tr.language === locale)!;
      const userTranslation = this.form.controls['wordTranslation'].value;

      const isApproved = userTranslation === translation;

      this.dialogRef.close(isApproved);
    }
  }
}
