import { IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddUserWordDto {
  @ApiProperty({ example: 123, description: 'ID слова' })
  @IsNotEmpty()
  wordId: number;

  @ApiProperty({ example: false, description: 'Пометить слово как изученное', default: false })
  @IsBoolean()
  isLearnt: boolean;
}
