import { IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExerciseDto {
  @ApiProperty({ example: 1, description: 'ID урока, к которому относится упражнение' })
  @IsInt()
  lessonId: number;

  @ApiProperty({ example: 'Какой артикль используется перед словом "apple"?', description: 'Вопрос упражнения' })
  @IsString()
  question: string;

  @ApiProperty({ example: 2, description: 'ID правильного варианта ответа' })
  @IsInt()
  correctOptionId: number;
}
