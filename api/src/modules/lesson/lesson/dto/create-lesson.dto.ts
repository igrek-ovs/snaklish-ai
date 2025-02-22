import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { LessonLevel } from '../lesson.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLessonDto {
  @ApiProperty({ example: 'Past Simple', description: 'Название урока' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Как использовать Past Simple?', description: 'Описание урока', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'A2', description: 'Уровень урока', enum: LessonLevel })
  @IsEnum(LessonLevel)
  @IsNotEmpty()
  level: LessonLevel;

  @ApiProperty({ example: 'Объяснение...', description: 'Основной контент урока' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 'https://youtu.be/xyz', description: 'Ссылка на YouTube видео', required: false })
  @IsString()
  @IsOptional()
  youtubeLink?: string;
}
