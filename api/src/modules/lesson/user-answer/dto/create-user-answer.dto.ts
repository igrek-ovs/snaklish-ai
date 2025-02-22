import { IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserAnswerDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID пользователя' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 1, description: 'ID упражнения' })
  @IsInt()
  exerciseId: number;

  @ApiProperty({ example: 2, description: 'ID выбранного варианта ответа' })
  @IsInt()
  selectedOptionId: number;
}
