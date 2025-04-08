import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { WordTranslation } from '../word-translation/word-translation.entity';
import { UserWord } from '../user-word/user-word.entity';

export enum WordLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2',
}

@Entity('words')
export class Word {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: WordLevel, nullable: false })
  level: WordLevel;

  @Column({ type: 'nvarchar', length: 255, unique: true, nullable: false })
  word: string;

  @Column({ type: 'nvarchar', length: 255, nullable: true })
  transcription?: string;

  @Column({ type: 'text', nullable: true })
  examples?: string;

  @Column({ type: 'blob', nullable: true })
  img?: Buffer;

  @OneToMany(() => WordTranslation, (translation) => translation.word, {
    cascade: true,
  })
  translations: WordTranslation[];
}
