import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Exercise } from '../exercise/exercise.entity';

export enum LessonLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2',
}

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'nvarchar', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: LessonLevel, nullable: false })
  level: LessonLevel;

  @Column({ type: 'nvarchar', nullable: false })
  content: string;

  @Column({ type: 'nvarchar', length: 255, nullable: true })
  youtubeLink: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Exercise, (exercise) => exercise.lesson)
  exercises: Exercise[];
}
