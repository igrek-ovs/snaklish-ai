import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from './exercise.entity';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectRepository(Exercise)
    private exerciseRepository: Repository<Exercise>,
  ) {}

  async getAllExercises(): Promise<Exercise[]> {
    return this.exerciseRepository.find({ relations: ['lesson'] });
  }

  async getExerciseById(id: number): Promise<Exercise> {
    const exercise = await this.exerciseRepository.findOne({
      where: { id },
      relations: ['lesson'],
    });

    if (!exercise) {
      throw new NotFoundException(`Упражнение с id ${id} не найдено`);
    }
    return exercise;
  }

  async createExercise(createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    const { lessonId, question, correctOptionId } = createExerciseDto;

    const exercise = this.exerciseRepository.create({
      question,
      lesson: { id: lessonId }, // Просто передаем ID урока
      correctOptionId,
    });

    return await this.exerciseRepository.save(exercise);
  }

  async updateExercise(id: number, updateExerciseDto: UpdateExerciseDto): Promise<Exercise> {
    await this.exerciseRepository.update(id, updateExerciseDto);
    return this.getExerciseById(id);
  }

  async deleteExercise(id: number): Promise<void> {
    const result = await this.exerciseRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Упражнение с id ${id} не найдено`);
    }
  }
}
