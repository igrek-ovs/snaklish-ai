import { IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserWordDto {
  @ApiProperty({ example: true, description: 'Пометить слово как изученное' })
  @IsBoolean()
  @IsNotEmpty()
  isLearnt: boolean;
}
