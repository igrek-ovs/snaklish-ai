import { IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExerciseOptionDto {
  @ApiProperty({ example: 1, description: 'ID упражнения, к которому относится вариант ответа' })
  @IsInt()
  exerciseId: number;

  @ApiProperty({ example: 'Вариант 1', description: 'Текст варианта ответа' })
  @IsString()
  optionText: string;
}
