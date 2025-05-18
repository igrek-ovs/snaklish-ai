import { Component, Inject } from '@angular/core';
import { ButtonComponent } from "../button/button.component";
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerX } from '@ng-icons/tabler-icons';
import { CURRENTLY_LEARNED_WORDS_LOCAL_STORAGE_KEY, DAILY_WORDS_LOCAL_STORAGE_KEY } from '@core/constants/local-storage.constants';

@Component({
  selector: 'app-daily-words-modal',
  imports: [ButtonComponent, NgIcon],
  providers: [provideIcons({ tablerX })],
  templateUrl: './daily-words-modal.component.html',
})
export class DailyWordsModalComponent {
  public wordsWork = [5, 10, 15];

  constructor(public readonly dialogRef: DialogRef, @Inject(DIALOG_DATA) public readonly data: { title: string, message: string },) {}

  public setWords(count: number) {
    localStorage.setItem(DAILY_WORDS_LOCAL_STORAGE_KEY, count.toString());
    localStorage.setItem(CURRENTLY_LEARNED_WORDS_LOCAL_STORAGE_KEY, '0');
    this.dialogRef.close();
  }
}
