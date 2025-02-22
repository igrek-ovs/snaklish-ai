import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExerciseOption } from './exercise-option.entity';
import { CreateExerciseOptionDto } from './dto/create-exercise-option.dto';
import { UpdateExerciseOptionDto } from './dto/update-exercise-option.dto';
import { Exercise } from '../exercise/exercise.entity';

@Injectable()
export class ExerciseOptionService {
  constructor(
    @InjectRepository(ExerciseOption)
    private optionRepository: Repository<ExerciseOption>,
    @InjectRepository(Exercise)
    private exerciseRepository: Repository<Exercise>,
  ) {}

  async getOptionsByExercise(exerciseId: number): Promise<ExerciseOption[]> {
    return this.optionRepository.find({
      where: { exercise: { id: exerciseId } },
    });
  }

  async createOption(createOptionDto: CreateExerciseOptionDto): Promise<ExerciseOption> {
    const { exerciseId, optionText } = createOptionDto;

    const exercise = await this.exerciseRepository.findOne({ where: { id: exerciseId } });
    if (!exercise) throw new NotFoundException(`Упражнение с id ${exerciseId} не найдено`);

    const option = this.optionRepository.create({ optionText, exercise });
    return await this.optionRepository.save(option);
  }

  async updateOption(id: number, updateOptionDto: UpdateExerciseOptionDto): Promise<ExerciseOption|null> {
    await this.optionRepository.update(id, updateOptionDto);
    return this.optionRepository.findOne({ where: { id } });
  }

  async deleteOption(id: number): Promise<void> {
    const result = await this.optionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Вариант ответа с id ${id} не найден`);
    }
  }
}
