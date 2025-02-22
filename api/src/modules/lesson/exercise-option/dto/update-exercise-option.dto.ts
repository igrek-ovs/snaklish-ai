import { PartialType } from '@nestjs/mapped-types';
import { CreateExerciseOptionDto } from './create-exercise-option.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateExerciseOptionDto extends PartialType(CreateExerciseOptionDto) {
  @ApiPropertyOptional({ example: 'Обновленный вариант ответа' })
  optionText?: string;
}
