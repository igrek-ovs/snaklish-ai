import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateWordTranslationDto {
  @ApiProperty({ example: 'Обновленный перевод', description: 'Текст перевода' })
  @IsNotEmpty()
  @IsString()
  translation: string;
}