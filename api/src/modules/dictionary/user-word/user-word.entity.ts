import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/user.entity';
import { Word } from '../word/word.entity';

@Entity('user_words')
export class UserWord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userWords, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Word, (word) => word.userWords, { onDelete: 'CASCADE' })
  word: Word;

  @Column({ type: 'boolean', default: false })
  isLearnt: boolean;
}
