import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Word } from '../word/word.entity';
import { UserWord } from '../user-word/user-word.entity';

export enum WordLanguage {
  FRENCH = 'FRENCH',
  SPANISH = 'SPANISH',
  GERMAN = 'GERMAN',
}

@Entity('word_translations')
export class WordTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Word, (word) => word.translations, { onDelete: 'CASCADE' })
  word: Word;

  @Column({ type: 'nvarchar', length: 255, nullable: false })
  translation: string;

  @Column({ type: 'enum', enum: WordLanguage, nullable: true })
  language: WordLanguage;

  @OneToMany(() => UserWord, (userWord) => userWord.translation)
  userWords: UserWord[];
}
