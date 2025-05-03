import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExerciseOption } from './exercise-option.entity';
import { CreateExerciseOptionDto } from './dto/create-exercise-option.dto';
import { UpdateExerciseOptionDto } from './dto/update-exercise-option.dto';
import { Exercise } from '../exercise/exercise.entity';

@Injectable()
export class ExerciseOptionService {
  private readonly logger = new Logger(ExerciseOptionService.name);

  constructor(
    @InjectRepository(ExerciseOption)
    private optionRepository: Repository<ExerciseOption>,
    @InjectRepository(Exercise)
    private exerciseRepository: Repository<Exercise>,
  ) {}

  async getOptionsByExercise(exerciseId: number): Promise<ExerciseOption[]> {
    try {
      const options = await this.optionRepository.find({
        where: { exercise: { id: exerciseId } },
      });
      this.logger.log(
        `Fetched ${options.length} options for exerciseId=${exerciseId}`,
      );
      return options;
    } catch (error) {
      this.logger.error(
        `Failed to fetch options for exerciseId=${exerciseId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to fetch exercise options',
      );
    }
  }

  async createOption(
    createOptionDto: CreateExerciseOptionDto,
  ): Promise<ExerciseOption> {
    const { exerciseId, optionText } = createOptionDto;

    try {
      const exercise = await this.exerciseRepository.findOne({
        where: { id: exerciseId },
      });
      if (!exercise) {
        this.logger.warn(`Exercise with ID ${exerciseId} not found`);
        throw new NotFoundException(`Exercise with ID ${exerciseId} not found`);
      }

      const option = this.optionRepository.create({ optionText, exercise });
      const savedOption = await this.optionRepository.save(option);
      this.logger.log(
        `Created option with ID: ${savedOption.id} for exerciseId=${exerciseId}`,
      );
      return savedOption;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Failed to create option for exerciseId=${exerciseId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to create option');
    }
  }

  async updateOption(
    id: number,
    updateOptionDto: UpdateExerciseOptionDto,
  ): Promise<ExerciseOption | null> {
    try {
      const existingOption = await this.optionRepository.findOne({
        where: { id },
      });
      if (!existingOption) {
        this.logger.warn(`Option with ID ${id} not found`);
        throw new NotFoundException(`Option with ID ${id} not found`);
      }

      await this.optionRepository.update(id, updateOptionDto);
      this.logger.log(`Updated option with ID: ${id}`);
      return this.optionRepository.findOne({ where: { id } });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Failed to update option with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to update option');
    }
  }

  async deleteOption(id: number): Promise<void> {
    try {
      const result = await this.optionRepository.delete(id);
      if (result.affected === 0) {
        this.logger.warn(`Option with ID ${id} not found for deletion`);
        throw new NotFoundException(`Option with ID ${id} not found`);
      }
      this.logger.log(`Deleted option with ID: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Failed to delete option with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to delete option');
    }
  }
}
