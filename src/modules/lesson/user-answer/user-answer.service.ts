import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAnswer } from './user-answer.entity';
import { CreateUserAnswerDto } from './dto/create-user-answer.dto';
import { User } from '../../user/user.entity';
import { Exercise } from '../exercise/exercise.entity';
import { ExerciseOption } from '../exercise-option/exercise-option.entity';

@Injectable()
export class UserAnswerService {
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
    return this.userAnswerRepository.find({
      where: { user: { id: userId } },
      relations: ['exercise', 'selectedOption'],
    });
  }

  async submitAnswer(createUserAnswerDto: CreateUserAnswerDto): Promise<UserAnswer> {
    const { userId, exerciseId, selectedOptionId } = createUserAnswerDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`Пользователь с id ${userId} не найден`);

    const exercise = await this.exerciseRepository.findOne({ where: { id: exerciseId } });
    if (!exercise) throw new NotFoundException(`Упражнение с id ${exerciseId} не найдено`);

    const selectedOption = await this.optionRepository.findOne({ where: { id: selectedOptionId } });
    if (!selectedOption) throw new NotFoundException(`Вариант ответа с id ${selectedOptionId} не найден`);

    const isCorrect = selectedOption.id === exercise.correctOptionId;

    const userAnswer = this.userAnswerRepository.create({
      user,
      exercise,
      selectedOption,
      isCorrect,
    });

    return await this.userAnswerRepository.save(userAnswer);
  }

  async deleteUserAnswer(id: number): Promise<void> {
    const result = await this.userAnswerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Ответ с id ${id} не найден`);
    }
  }
}
