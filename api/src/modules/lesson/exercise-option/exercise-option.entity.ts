import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Exercise } from '../exercise/exercise.entity';

@Entity('exercise_options')
export class ExerciseOption {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Exercise, (exercise) => exercise.options, { onDelete: 'CASCADE' })
  exercise: Exercise;

  @Column({ type: 'nvarchar', nullable: false })
  optionText: string;
}
