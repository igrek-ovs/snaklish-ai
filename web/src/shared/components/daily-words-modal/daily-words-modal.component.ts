import { Component, Inject } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerX } from '@ng-icons/tabler-icons';
import {
  CURRENTLY_LEARNED_WORDS_LOCAL_STORAGE_KEY,
  DAILY_WORDS_LOCAL_STORAGE_KEY,
  NEW_DAY_TO_LEARN_STORAGE_KEY,
} from '@core/constants/local-storage.constants';

@Component({
  selector: 'app-daily-words-modal',
  imports: [ButtonComponent, NgIcon],
  providers: [provideIcons({ tablerX })],
  templateUrl: './daily-words-modal.component.html',
})
export class DailyWordsModalComponent {
  public wordsWork = [5, 10, 15, 'infinity'] as const;

  constructor(
    public readonly dialogRef: DialogRef,
    @Inject(DIALOG_DATA) public readonly data: { title: string; message: string }
  ) {}

  public setWords(count: number | 'infinity') {
    if (count === 'infinity') {
      localStorage.setItem(DAILY_WORDS_LOCAL_STORAGE_KEY, 'infinity');
      localStorage.setItem(CURRENTLY_LEARNED_WORDS_LOCAL_STORAGE_KEY, '0');

      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(NEW_DAY_TO_LEARN_STORAGE_KEY, today);
      this.dialogRef.close();
      return;
    }

    localStorage.setItem(DAILY_WORDS_LOCAL_STORAGE_KEY, count.toString());
    localStorage.setItem(CURRENTLY_LEARNED_WORDS_LOCAL_STORAGE_KEY, '0');

    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(NEW_DAY_TO_LEARN_STORAGE_KEY, today);
    this.dialogRef.close();
  }
}
