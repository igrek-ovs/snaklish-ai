import { Controller, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { LessonProgressService } from './lesson-progress.service';
import { UpdateLessonProgressDto } from './dto/update-lesson-progress.dto';
import { LessonProgress } from './lesson-progress.entity';

@Controller('lesson-progress')
export class LessonProgressController {
  constructor(private readonly lessonProgressService: LessonProgressService) {}

  @Get(':userId')
  getUserProgress(@Param('userId') userId: string): Promise<LessonProgress[]> {
    return this.lessonProgressService.getUserLessonProgress(userId);
  }

  @Patch(':userId/:lessonId')
  markLessonCompleted(@Param('userId') userId: string, @Param('lessonId') lessonId: number): Promise<LessonProgress> {
    return this.lessonProgressService.markLessonAsCompleted(userId, lessonId);
  }

  @Patch(':id')
  updateProgress(@Param('id') id: number, @Body() updateProgressDto: UpdateLessonProgressDto): Promise<LessonProgress|null> {
    return this.lessonProgressService.updateLessonProgress(id, updateProgressDto);
  }

  @Delete(':id')
  deleteProgress(@Param('id') id: number): Promise<void> {
    return this.lessonProgressService.deleteLessonProgress(id);
  }
}
