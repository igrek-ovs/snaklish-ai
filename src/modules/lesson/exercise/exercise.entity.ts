import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Lesson } from '../lesson/lesson.entity';
import { ExerciseOption } from '../exercise-option/exercise-option.entity';


@Entity('exercises')
export class Exercise {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Lesson, (lesson) => lesson.exercises, { onDelete: 'CASCADE' })
  lesson: Lesson;

  @Column({ type: 'nvarchar', nullable: false })
  question: string;

  @OneToMany(() => ExerciseOption, (option) => option.exercise, { cascade: true })
  options: ExerciseOption[];

  @Column({ type: 'int', nullable: false })
  correctOptionId: number; // Указывает, какой вариант ответа правильный
}
