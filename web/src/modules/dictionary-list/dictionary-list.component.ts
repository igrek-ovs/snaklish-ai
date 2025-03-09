import { Component } from '@angular/core';
import { TableComponent } from '../../shared/components/table/table.component';
import {
  ActionConfig,
  ColumnDef,
  ColumnType,
} from '../../shared/components/table/header-def.model';

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
  styles: ``,
})
export class DictionaryListComponent {
  public readonly wordActions: ActionConfig<Word>[] = [
    {
      icon: 'tablerEdit',
      tooltip: 'Edit word',
      eventName: 'edit',
      iconClass: 'icon-default',
    },
    {
      icon: 'tablerTrash',
      tooltip: 'Delete word',
      eventName: 'delete',
      iconClass: 'icon-danger',
    }
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
    },
  ];

  public words: Word[] = [
    { id: 1, word: 'hello', translation: 'привіт', origin: 'This word was Lorem ipsum, dolor sit amet consectetur adipisicing elit. In distinctio pariatur nulla explicabo repellat. Ex placeat dolores vitae voluptatem qui molestiae neque. Necessitatibus nobis recusandae repellendus facere? Sapiente, ullam assumenda!' },
    { id: 2, word: 'goodbye', translation: 'до побачення' },
    { id: 3, word: 'please', translation: 'будь ласка' },
    { id: 4, word: 'thank you', translation: 'дякую' },
    { id: 5, word: 'sorry', translation: 'вибачте' },
    { id: 6, word: 'yes', translation: 'так' },
    { id: 7, word: 'no', translation: 'ні' },
    { id: 8, word: 'excuse me', translation: 'перепрошую' },
    { id: 9, word: 'good morning', translation: 'доброго ранку' },
    { id: 10, word: 'good night', translation: 'на добраніч' },
    { id: 11, word: 'how are you?', translation: 'як справи?' },
    { id: 12, word: 'I am fine', translation: 'я в порядку' },
    { id: 13, word: 'what is your name?', translation: 'як вас звати?' },
    { id: 14, word: 'my name is...', translation: 'мене звати...' },
    { id: 15, word: 'I don’t understand', translation: 'я не розумію' },
    { id: 16, word: 'could you repeat that?', translation: 'ви можете повторити?' },
    { id: 17, word: 'where is the restroom?', translation: 'де знаходиться туалет?' },
    { id: 18, word: 'how much does it cost?', translation: 'скільки це коштує?' },
    { id: 19, word: 'I love you', translation: 'я тебе люблю' },
    { id: 20, word: 'see you later', translation: 'до зустрічі' }
  ];

  constructor() {}
}
