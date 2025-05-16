import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsBoolean } from 'class-validator';

export class AddUserWordDto {
  @ApiProperty({ example: 123, description: 'ID перевода слова' })
  @Type(() => Number)
  @IsInt({ message: 'translationId must be an integer' })
  translationId: number;

  @ApiProperty({
    example: false,
    description: 'Пометить слово как изученное',
    default: false,
  })
  @Type(() => Boolean)
  @IsBoolean({ message: 'isLearnt must be a boolean' })
  isLearnt: boolean;
}
