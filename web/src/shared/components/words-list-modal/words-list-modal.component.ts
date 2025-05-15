import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit, signal } from '@angular/core';
import { Word } from '@core/models';
import { WordsService } from '@core/services';
import { ButtonComponent } from "../button/button.component";
import { tap } from 'rxjs';
import { SpinnerComponent } from "../spinner/spinner.component";

@Component({
  selector: 'app-words-list-modal',
  imports: [ButtonComponent, SpinnerComponent],
  templateUrl: './words-list-modal.component.html',
})
export class WordsListModalComponent implements OnInit {
  public words = signal<Word[]>([]);
  public isLoading = signal<boolean>(true);

  constructor(public readonly dialogRef: DialogRef, private readonly wordsService: WordsService) {}

  ngOnInit(): void {
    this.wordsService.getWords().pipe(
      tap((res) => {
        this.words.set(res.items);
        this.isLoading.set(false);
      }),
    ).subscribe();
  }
}
