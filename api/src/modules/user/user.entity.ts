import {
  Column,
  CreateDateColumn,
  Entity, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { LessonProgress } from '../lesson/lesson-progress/lesson-progress.entity';
import { UserAnswer } from '../lesson/user-answer/user-answer.entity';
import { UserWord } from '../dictionary/user-word/user-word.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'Уникальный идентификатор пользователя' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Иван Иванов', description: 'Имя пользователя', maxLength: 100 })
  @Column({ length: 100, nullable: false })
  name: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email пользователя (уникальный)', maxLength: 150 })
  @Column({ unique: true, length: 150, nullable: false })
  email: string;

  @ApiProperty({ example: 'hashedpassword123', description: 'Хеш пароля', writeOnly: true })
  @Column({ nullable: false })
  passwordHash: string;

  @ApiProperty({ example: false, description: 'Флаг подтверждения email' })
  @Column({ default: false })
  isEmailConfirmed: boolean;

  @ApiProperty({ example: '2025-02-16T12:00:00.000Z', description: 'Дата создания пользователя', type: 'string', format: 'date-time' })
  @CreateDateColumn({ type: 'datetime', nullable: true })
  createdAt: Date;

  @ApiProperty({ example: '2025-02-16T12:00:00.000Z', description: 'Дата последнего обновления', type: 'string', format: 'date-time' })
  @UpdateDateColumn({ type: 'datetime', nullable: true })
  updatedAt: Date;


  @ApiProperty({ example: 'user', description: 'Роль пользователя', enum: UserRole, default: UserRole.USER })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => UserAnswer, (answer) => answer.user)
  answers: UserAnswer[];

  @OneToMany(() => LessonProgress, (progress) => progress.user)
  progress: LessonProgress[];

  @OneToMany(() => UserWord, (userWord) => userWord.user, { cascade: true })
  userWords: UserWord[];
}
