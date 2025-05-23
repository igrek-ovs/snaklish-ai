import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit, signal } from '@angular/core';
import { Word } from '@core/models';
import { WordsService } from '@core/services';
import { ButtonComponent } from '../button/button.component';
import { map, tap } from 'rxjs';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-words-list-modal',
  imports: [ButtonComponent, SpinnerComponent],
  templateUrl: './words-list-modal.component.html',
})
export class WordsListModalComponent implements OnInit {
  public words = signal<Word[]>([]);
  public isLoading = signal<boolean>(true);

  constructor(
    public readonly dialogRef: DialogRef,
    private readonly wordsService: WordsService,
    @Inject(DIALOG_DATA) public readonly data: { cId: number }
  ) {}

  ngOnInit(): void {
    this.wordsService
      .getWords()
      .pipe(
        map((res) => res.items),
        map((words) => {
          const filteredByCategoryWords = words.filter((w) => w.categoryId === this.data.cId);
          return filteredByCategoryWords;
        }),
        tap((words) => {
          this.words.set(words);
          this.isLoading.set(false);
        })
      )
      .subscribe();
  }
}
