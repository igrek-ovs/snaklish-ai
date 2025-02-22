import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Lesson } from '../lesson/lesson.entity';
import { User } from '../../user/user.entity';


@Entity('lesson_progress')
export class LessonProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.progress, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Lesson, { onDelete: 'CASCADE' })
  lesson: Lesson;

  @Column({ type: 'boolean', default: false })
  completed: boolean;

  @CreateDateColumn({ nullable: true })
  completedAt: Date | null;
}
