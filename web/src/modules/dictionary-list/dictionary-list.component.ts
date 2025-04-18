import { Component, signal } from '@angular/core';
import { TableComponent } from '../../shared/components/table/table.component';
import { Word } from '../../core/models/word.model';
import { WordsService } from '../../core/services/words.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-dictionary-list',
  imports: [TableComponent],
  templateUrl: './dictionary-list.component.html',
})
export class DictionaryListComponent {
  public words = signal<Word[]>([]);

  constructor(private readonly wordsService: WordsService) {
    this.loadWords();
  }

  private loadWords() {
    this.wordsService
      .getWords()
      .pipe(
        tap((words) => {
          this.words.set(words);
          console.log(words);
        })
      )
      .subscribe();
  }
}
