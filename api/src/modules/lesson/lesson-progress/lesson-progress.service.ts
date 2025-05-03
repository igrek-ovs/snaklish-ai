import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LessonProgress } from './lesson-progress.entity';
import { User } from '../../user/user.entity';
import { Lesson } from '../lesson/lesson.entity';
import { UpdateLessonProgressDto } from './dto/update-lesson-progress.dto';

@Injectable()
export class LessonProgressService {
  private readonly logger = new Logger(LessonProgressService.name);

  constructor(
    @InjectRepository(LessonProgress)
    private lessonProgressRepository: Repository<LessonProgress>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
  ) {}

  async getUserLessonProgress(userId: string): Promise<LessonProgress[]> {
    try {
      const progress = await this.lessonProgressRepository.find({
        where: { user: { id: userId } },
        relations: ['lesson'],
      });
      this.logger.log(
        `Fetched ${progress.length} lesson progress records for userId=${userId}`,
      );
      return progress;
    } catch (error) {
      this.logger.error(
        `Failed to fetch lesson progress for userId=${userId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to fetch lesson progress');
    }
  }

  async markLessonAsCompleted(
    userId: string,
    lessonId: number,
  ): Promise<LessonProgress> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        this.logger.warn(`User with ID ${userId} not found`);
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const lesson = await this.lessonRepository.findOne({
        where: { id: lessonId },
      });
      if (!lesson) {
        this.logger.warn(`Lesson with ID ${lessonId} not found`);
        throw new NotFoundException(`Lesson with ID ${lessonId} not found`);
      }

      let progress = await this.lessonProgressRepository.findOne({
        where: { user, lesson },
      });

      if (!progress) {
        progress = this.lessonProgressRepository.create({
          user,
          lesson,
          completed: true,
          completedAt: new Date(),
        });
        this.logger.log(
          `Created new progress record for userId=${userId}, lessonId=${lessonId}`,
        );
      } else {
        progress.completed = true;
        progress.completedAt = new Date();
        this.logger.log(
          `Updated existing progress record for userId=${userId}, lessonId=${lessonId}`,
        );
      }

      return await this.lessonProgressRepository.save(progress);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Failed to mark lesson as completed for userId=${userId}, lessonId=${lessonId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to mark lesson as completed',
      );
    }
  }

  async updateLessonProgress(
    id: number,
    updateProgressDto: UpdateLessonProgressDto,
  ): Promise<LessonProgress | null> {
    try {
      const existingProgress = await this.lessonProgressRepository.findOne({
        where: { id },
      });
      if (!existingProgress) {
        this.logger.warn(`Lesson progress with ID ${id} not found`);
        throw new NotFoundException(`Lesson progress with ID ${id} not found`);
      }

      await this.lessonProgressRepository.update(id, updateProgressDto);
      this.logger.log(`Updated lesson progress with ID: ${id}`);
      return this.lessonProgressRepository.findOne({ where: { id } });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Failed to update lesson progress with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to update lesson progress',
      );
    }
  }

  async deleteLessonProgress(id: number): Promise<void> {
    try {
      const result = await this.lessonProgressRepository.delete(id);
      if (result.affected === 0) {
        this.logger.warn(
          `Lesson progress with ID ${id} not found for deletion`,
        );
        throw new NotFoundException(`Lesson progress with ID ${id} not found`);
      }
      this.logger.log(`Deleted lesson progress with ID: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Failed to delete lesson progress with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to delete lesson progress',
      );
    }
  }
}
