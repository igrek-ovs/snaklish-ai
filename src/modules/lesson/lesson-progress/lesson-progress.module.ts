import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonProgress } from './lesson-progress.entity';
import { LessonProgressService } from './lesson-progress.service';
import { LessonProgressController } from './lesson-progress.controller';
import { User } from '../../user/user.entity';
import { Lesson } from '../lesson/lesson.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LessonProgress, User, Lesson])],
  controllers: [LessonProgressController],
  providers: [LessonProgressService],
  exports: [LessonProgressService],
})
export class LessonProgressModule {}
