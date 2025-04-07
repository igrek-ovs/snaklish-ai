import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {WordLanguage} from "../word-translation.entity";

export class CreateWordTranslationDto {
  @ApiProperty({ example: 1, description: 'ID слова' })
  @IsNotEmpty()
  @IsNumber()
  wordId: number;

  @ApiProperty({ example: 'Перевод слова', description: 'Текст перевода' })
  @IsNotEmpty()
  @IsString()
  translation: string;

  @ApiProperty({
    example: 'ENGLISH',
    enum: WordLanguage,
    description: 'Language of the word',
    required: false,
  })
  @IsOptional()
  @IsEnum(WordLanguage)
  language?: WordLanguage;
}
