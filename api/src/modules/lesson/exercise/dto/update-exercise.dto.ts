import { PartialType } from '@nestjs/mapped-types';
import { CreateExerciseDto } from './create-exercise.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateExerciseDto extends PartialType(CreateExerciseDto) {
  @ApiPropertyOptional({ example: 'Обновленный вопрос', description: 'Обновленный текст вопроса' })
  question?: string;

  @ApiPropertyOptional({ example: 1, description: 'Обновленный ID правильного варианта ответа' })
  correctOptionId?: number;
}
