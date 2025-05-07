import { Component, signal } from '@angular/core';
import { TableComponent } from '../../shared/components/table/table.component';
import { AddWordRequest, Word } from '../../core/models/word.model';
import { WordsService } from '../../core/services/words.service';
import { filter, finalize, Observable, switchMap, tap } from 'rxjs';
import { ActionConfig, ColumnDef, ColumnType } from '@shared/components/table/header-def.model';
import { ButtonComponent } from "../../shared/components/button/button.component";
import { Dialog, DialogRef, DEFAULT_DIALOG_CONFIG } from '@angular/cdk/dialog';
import { ManageWordDialogComponent } from '@shared/components/manage-word-dialog/manage-word-dialog.component';

@Component({
  selector: 'app-dictionary-list',
  imports: [TableComponent, ButtonComponent],
  templateUrl: './dictionary-list.component.html',
  providers: [
    {
      provide: DEFAULT_DIALOG_CONFIG,
      useValue: {
        hasBackdrop: true,
      }
    }
  ]
})
export class DictionaryListComponent {
  public words = signal<Word[]>([]);
  public isLoading = signal<boolean>(false);

  public readonly wordActions: ActionConfig<Word>[] = [
    {
      icon: 'tablerEdit',
      tooltip: 'Edit word',
      eventName: 'Edit',
      iconClass: 'icon-default',
      isAvailable: () => true
    },
    {
      icon: 'tablerTrash',
      tooltip: 'Delete word',
      eventName: 'Delete',
      iconClass: 'icon-delete',
      isAvailable: () => true
    }
  ]


  public readonly headers: ColumnDef<Word>[] = [
    {
      fieldName: 'word',
      displayName: 'Word',
      type: ColumnType.Text,
    }, 
    {
      fieldName: 'transcription',
      displayName: 'Transcription',
      type: ColumnType.Text,
    },
    {
      fieldName: 'level',
      displayName: 'Level',
      type: ColumnType.Text,
    },
  ];

  constructor(private readonly wordsService: WordsService, private readonly dialog: Dialog) {
    this.loadWords();
  }

  private loadWords() {
    this.isLoading.set(true);
  
    this.wordsService.getWords().pipe(
      tap(words => {
        this.words.set(words);
      }),
      finalize(() => {
        this.isLoading.set(false);
      })
    ).subscribe();
  }

  public addNewWord() {
    const req: AddWordRequest = {
      level: '',
      word: '',
      transcription: '',
      examples: '',
      categoryId: 1,
    }

    const dialogRef = this.dialog.open(ManageWordDialogComponent, {
      data: req,

    });

    (dialogRef.closed as Observable<AddWordRequest>)
    .pipe(
      filter((response) => !!response),
      tap(() => this.isLoading.set(true)),
      switchMap((req) => this.wordsService.addWord(req)),
      tap(() => this.isLoading.set(false)),
      tap(() => this.loadWords())
    ).subscribe();

  }
}
