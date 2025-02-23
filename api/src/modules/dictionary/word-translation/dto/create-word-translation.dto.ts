import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateWordTranslationDto {
  @ApiProperty({ example: 1, description: 'ID слова' })
  @IsNotEmpty()
  @IsNumber()
  wordId: number;

  @ApiProperty({ example: 'Перевод слова', description: 'Текст перевода' })
  @IsNotEmpty()
  @IsString()
  translation: string;
}
