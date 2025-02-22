import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Lesson } from './lesson.entity';

@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Get()
  getAllLessons(): Promise<Lesson[]> {
    return this.lessonService.getAllLessons();
  }

  @Get(':id')
  getLessonById(@Param('id') id: number): Promise<Lesson> {
    return this.lessonService.getLessonById(id);
  }

  @Post()
  createLesson(@Body() createLessonDto: CreateLessonDto): Promise<Lesson> {
    return this.lessonService.createLesson(createLessonDto);
  }

  @Patch(':id')
  updateLesson(
    @Param('id') id: number,
    @Body() updateLessonDto: UpdateLessonDto,
  ): Promise<Lesson> {
    return this.lessonService.updateLesson(id, updateLessonDto);
  }

  @Delete(':id')
  deleteLesson(@Param('id') id: number): Promise<void> {
    return this.lessonService.deleteLesson(id);
  }
}
