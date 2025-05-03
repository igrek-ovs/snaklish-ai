import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from './exercise.entity';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExerciseService {
  private readonly logger = new Logger(ExerciseService.name);

  constructor(
    @InjectRepository(Exercise)
    private exerciseRepository: Repository<Exercise>,
  ) {}

  async getAllExercises(): Promise<Exercise[]> {
    try {
      const exercises = await this.exerciseRepository.find({
        relations: ['lesson'],
      });
      this.logger.log(`Fetched ${exercises.length} exercises`);
      return exercises;
    } catch (error) {
      this.logger.error(
        `Failed to fetch exercises: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to fetch exercises');
    }
  }

  async getExerciseById(id: number): Promise<Exercise> {
    try {
      const exercise = await this.exerciseRepository.findOne({
        where: { id },
        relations: ['lesson'],
      });

      if (!exercise) {
        this.logger.warn(`Exercise with ID ${id} not found`);
        throw new NotFoundException(`Exercise with ID ${id} not found`);
      }
      this.logger.log(`Fetched exercise with ID: ${id}`);
      return exercise;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Failed to fetch exercise with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to fetch exercise');
    }
  }

  async createExercise(
    createExerciseDto: CreateExerciseDto,
  ): Promise<Exercise> {
    try {
      const { lessonId, question, correctOptionId } = createExerciseDto;

      const exercise = this.exerciseRepository.create({
        question,
        lesson: { id: lessonId },
        correctOptionId,
      });

      const savedExercise = await this.exerciseRepository.save(exercise);
      this.logger.log(`Created exercise with ID: ${savedExercise.id}`);
      return savedExercise;
    } catch (error) {
      this.logger.error(
        `Failed to create exercise: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to create exercise');
    }
  }

  async updateExercise(
    id: number,
    updateExerciseDto: UpdateExerciseDto,
  ): Promise<Exercise> {
    try {
      const existingExercise = await this.exerciseRepository.findOne({
        where: { id },
      });
      if (!existingExercise) {
        this.logger.warn(`Exercise with ID ${id} not found`);
        throw new NotFoundException(`Exercise with ID ${id} not found`);
      }

      await this.exerciseRepository.update(id, updateExerciseDto);
      this.logger.log(`Updated exercise with ID: ${id}`);
      return this.getExerciseById(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Failed to update exercise with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to update exercise');
    }
  }

  async deleteExercise(id: number): Promise<void> {
    try {
      const result = await this.exerciseRepository.delete(id);
      if (result.affected === 0) {
        this.logger.warn(`Exercise with ID ${id} not found for deletion`);
        throw new NotFoundException(`Exercise with ID ${id} not found`);
      }
      this.logger.log(`Deleted exercise with ID: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Failed to delete exercise with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to delete exercise');
    }
  }
}
