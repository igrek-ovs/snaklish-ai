import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Word } from '../word/word.entity';

@Entity('word_translations')
export class WordTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Word, (word) => word.translations, { onDelete: 'CASCADE' })
  word: Word;

  @Column({ type: 'nvarchar', length: 255, nullable: false })
  translation: string;
}
