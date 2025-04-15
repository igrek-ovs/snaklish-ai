import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { WordLevel } from '../word.entity';
import { Type } from 'class-transformer';

export class CreateWordDto {
  @ApiProperty({ example: 'A2', description: 'English word level' })
  @IsEnum(WordLevel)
  level: WordLevel;

  @ApiProperty({ example: 'мати', description: 'Word on ukrainian' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  word: string;

  @ApiProperty({
    example: 'ˈmʌðər',
    description: 'Transcription of the word',
    required: false,
  })
  @IsOptional()
  @IsString()
  transcription?: string;

  @ApiProperty({
    example: 'She is my mother. I love my mother.',
    description: 'Example sentences for the word',
    required: false,
  })
  @IsOptional()
  @IsString()
  examples?: string;

  @ApiProperty({
    example: '1',
    description: 'Id of the category',
    required: true,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  categoryId: number;
}
