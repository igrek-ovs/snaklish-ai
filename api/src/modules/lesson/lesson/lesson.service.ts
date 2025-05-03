import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './lesson.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonService {
  private readonly logger = new Logger(LessonService.name);

  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
  ) {}

  async getAllLessons(): Promise<Lesson[]> {
    try {
      const lessons = await this.lessonRepository.find();
      this.logger.log(`Fetched ${lessons.length} lessons`);
      return lessons;
    } catch (error) {
      this.logger.error(
        `Failed to fetch lessons: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to fetch lessons');
    }
  }

  async getLessonById(id: number): Promise<Lesson> {
    try {
      const lesson = await this.lessonRepository.findOne({ where: { id } });
      if (!lesson) {
        this.logger.warn(`Lesson with ID ${id} not found`);
        throw new NotFoundException(`Lesson with ID ${id} not found`);
      }
      this.logger.log(`Fetched lesson with ID: ${id}`);
      return lesson;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Failed to fetch lesson with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to fetch lesson');
    }
  }

  async createLesson(createLessonDto: CreateLessonDto): Promise<Lesson> {
    try {
      const lesson = this.lessonRepository.create(createLessonDto);
      const savedLesson = await this.lessonRepository.save(lesson);
      this.logger.log(`Created lesson with ID: ${savedLesson.id}`);
      return savedLesson;
    } catch (error) {
      this.logger.error(
        `Failed to create lesson: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to create lesson');
    }
  }

  async updateLesson(
    id: number,
    updateLessonDto: UpdateLessonDto,
  ): Promise<Lesson> {
    try {
      const existingLesson = await this.lessonRepository.findOne({
        where: { id },
      });
      if (!existingLesson) {
        this.logger.warn(`Lesson with ID ${id} not found`);
        throw new NotFoundException(`Lesson with ID ${id} not found`);
      }

      await this.lessonRepository.update(id, updateLessonDto);
      this.logger.log(`Updated lesson with ID: ${id}`);
      return this.getLessonById(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Failed to update lesson with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to update lesson');
    }
  }

  async deleteLesson(id: number): Promise<void> {
    try {
      const result = await this.lessonRepository.delete(id);
      if (result.affected === 0) {
        this.logger.warn(`Lesson with ID ${id} not found for deletion`);
        throw new NotFoundException(`Lesson with ID ${id} not found`);
      }
      this.logger.log(`Deleted lesson with ID: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Failed to delete lesson with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to delete lesson');
    }
  }
}
