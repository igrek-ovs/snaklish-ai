import { Component } from '@angular/core';
import { TableComponent } from '../../shared/components/table/table.component';
import { ActionConfig, ColumnDef, ColumnType } from '../../shared/components/table/header-def.model';

interface Word {
  id: number;
  word: string;
  origin?: string;
  translation: string;
}

@Component({
  selector: 'app-dictionary-list',
  imports: [TableComponent],
  templateUrl: './dictionary-list.component.html',
  styles: ``
})
export class DictionaryListComponent {

  public readonly wordActions: ActionConfig<Word>[] = [
    {
      icon: 'tablerEdit',
      tooltip: 'Edit word',
      eventName: 'edit',
      iconClass: 'icon-default',
    },
  ];

  public readonly columns: ColumnDef<Word>[] = [
    {
      fieldName: 'id',
      displayName: 'ID',
      type: ColumnType.Text,
    },
    {
      fieldName: 'word',
      displayName: 'Word',
      type: ColumnType.Text,
    },
    {
      fieldName: 'translation',
      displayName: 'Translation',
      type: ColumnType.Text,
    },
    {
      fieldName: 'origin',
      displayName: 'Origin',
      type: ColumnType.Text,
    }
  ];

  public words: Word[] = [
    { id: 1, word: 'hello', translation: 'hola', origin: 'This word was Lorem ipsum, dolor sit amet consectetur adipisicing elit. In distinctio pariatur nulla explicabo repellat. Ex placeat dolores vitae voluptatem qui molestiae neque. Necessitatibus nobis recusandae repellendus facere? Sapiente, ullam assumenda!' },
    { id: 2, word: 'goodbye', translation: 'adiós' }
  ];

  constructor() {

  }
}
