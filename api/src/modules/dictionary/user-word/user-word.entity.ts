import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/user.entity';
import { WordTranslation } from '../word-translation/word-translation.entity';

@Entity('user_words')
export class UserWord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userWords, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => WordTranslation, (translation) => translation.userWords, {
    onDelete: 'CASCADE',
  })
  translation: WordTranslation;

  @Column({ type: 'boolean', default: false })
  isLearnt: boolean;
}
