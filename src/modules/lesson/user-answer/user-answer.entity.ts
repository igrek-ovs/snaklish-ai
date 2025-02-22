import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { User } from '../../user/user.entity';
import { ExerciseOption } from '../exercise-option/exercise-option.entity';
import { Exercise } from '../exercise/exercise.entity';

@Entity('user_answers')
export class UserAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.answers, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Exercise, { onDelete: 'CASCADE' })
  exercise: Exercise;

  @ManyToOne(() => ExerciseOption, { onDelete: 'CASCADE' })
  selectedOption: ExerciseOption;

  @Column({ type: 'boolean', nullable: false })
  isCorrect: boolean;

  @CreateDateColumn()
  answeredAt: Date;
}
