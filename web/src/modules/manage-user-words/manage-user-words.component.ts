import { Component, OnInit, signal } from '@angular/core';
import { TableComponent } from '@shared/components/table/table.component';
import { BasicPageWrapperComponent } from '../../shared/components/basic-page-wrapper/basic-page-wrapper.component';
import { UserWordsService } from '@core/services/user-words.service';
import { finalize, forkJoin, tap } from 'rxjs';
import { UserWord, Word } from '@core/models';
import { ColumnDef, ColumnType } from '@shared/components/table/header-def.model';
import { ChipColorsEnum } from '@shared/components/chip/chip.component';

@Component({
  selector: 'app-manage-user-words',
  imports: [TableComponent, BasicPageWrapperComponent],
  templateUrl: './manage-user-words.component.html',
})
export class ManageUserWordsComponent implements OnInit {
  public words = signal<UserWord[]>([]);
  public isLoading = signal<boolean>(true);
  public localeCode = signal<string>('en');

  public readonly headers: ColumnDef<UserWord>[] = [
    {
      fieldName: 'id',
      displayName: 'ID',
      type: ColumnType.Text,
    },
    {
      fieldName: 'isLearnt',
      displayName: 'Word status',
      type: ColumnType.Chip,
      colors: [ChipColorsEnum.Learned, ChipColorsEnum.Unlearned],
      labels: ['Learned', 'Unlearned'],
    },
    {
      fieldName: 'translation',
      displayName: 'Word translation',
      type: ColumnType.Text,
      formatter: (tr: { id: number; translation: string; word: Word }) => {
        return tr.translation + ' | ' + '<strong>' + tr.word.word + '</strong>';
      },
    },
  ];

  constructor(private readonly userWordsService: UserWordsService) {}

  ngOnInit(): void {
    forkJoin({
      unlearnedWords: this.userWordsService.getUnlearnedUserWords(),
      learnedWords: this.userWordsService.getLearnedUserWords(),
    })
      .pipe(
        tap(({ unlearnedWords, learnedWords }) => {
          const allUserWords = unlearnedWords.concat(learnedWords);
          this.words.set(allUserWords);
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe();
  }
}
