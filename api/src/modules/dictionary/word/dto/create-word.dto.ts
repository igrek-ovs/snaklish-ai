import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { WordLevel } from '../word.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWordDto {
  @ApiProperty({ example: 'A2', description: 'English word level' })
  @IsEnum(WordLevel)
  level: WordLevel;

  @ApiProperty({ example: 'мати', description: 'Word on ukrainian' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  word: string;
}
