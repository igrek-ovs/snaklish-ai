import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAnswer } from './user-answer.entity';
import { CreateUserAnswerDto } from './dto/create-user-answer.dto';
import { User } from '../../user/user.entity';
import { Exercise } from '../exercise/exercise.entity';
import { ExerciseOption } from '../exercise-option/exercise-option.entity';

@Injectable()
export class UserAnswerService {
  private readonly logger = new Logger(UserAnswerService.name);

  constructor(
    @InjectRepository(UserAnswer)
    private userAnswerRepository: Repository<UserAnswer>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Exercise)
    private exerciseRepository: Repository<Exercise>,
    @InjectRepository(ExerciseOption)
    private optionRepository: Repository<ExerciseOption>,
  ) {}

  async getAnswersByUser(userId: string): Promise<UserAnswer[]> {
    try {
      const answers = await this.userAnswerRepository.find({
        where: { user: { id: userId } },
        relations: ['exercise', 'selectedOption'],
      });
      this.logger.log(`Fetched ${answers.length} answers for userId=${userId}`);
      return answers;
    } catch (error) {
      this.logger.error(
        `Failed to fetch answers for userId=${userId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to fetch user answers');
    }
  }

  async submitAnswer(
    createUserAnswerDto: CreateUserAnswerDto,
  ): Promise<UserAnswer> {
    const { userId, exerciseId, selectedOptionId } = createUserAnswerDto;

    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        this.logger.warn(`User with ID ${userId} not found`);
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const exercise = await this.exerciseRepository.findOne({
        where: { id: exerciseId },
      });
      if (!exercise) {
        this.logger.warn(`Exercise with ID ${exerciseId} not found`);
        throw new NotFoundException(`Exercise with ID ${exerciseId} not found`);
      }

      const selectedOption = await this.optionRepository.findOne({
        where: { id: selectedOptionId },
      });
      if (!selectedOption) {
        this.logger.warn(
          `Exercise option with ID ${selectedOptionId} not found`,
        );
        throw new NotFoundException(
          `Exercise option with ID ${selectedOptionId} not found`,
        );
      }

      const isCorrect = selectedOption.id === exercise.correctOptionId;

      const userAnswer = this.userAnswerRepository.create({
        user,
        exercise,
        selectedOption,
        isCorrect,
      });

      const savedAnswer = await this.userAnswerRepository.save(userAnswer);
      this.logger.log(
        `Submitted answer ID ${savedAnswer.id} for userId=${userId}, exerciseId=${exerciseId}`,
      );
      return savedAnswer;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Failed to submit answer for userId=${userId}, exerciseId=${exerciseId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to submit user answer');
    }
  }

  async deleteUserAnswer(id: number): Promise<void> {
    try {
      const result = await this.userAnswerRepository.delete(id);
      if (result.affected === 0) {
        this.logger.warn(`Answer with ID ${id} not found for deletion`);
        throw new NotFoundException(`Answer with ID ${id} not found`);
      }
      this.logger.log(`Deleted answer with ID: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Failed to delete answer with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to delete user answer');
    }
  }
}
