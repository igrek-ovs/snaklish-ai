import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class SearchWordsDto {
  @ApiPropertyOptional({
    description: 'ID of the word',
    example: 123,
  })
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiPropertyOptional({
    description: 'Word to search for',
    example: 'apple',
  })
  @IsOptional()
  @IsString()
  word?: string;

  @ApiPropertyOptional({
    description: 'Transcription of the word',
    example: '[ˈæp.əl]',
  })
  @IsOptional()
  @IsString()
  transcription?: string;

  @ApiPropertyOptional({
    description: 'Translation of the word',
    example: 'яблуко',
  })
  @IsOptional()
  @IsString()
  translation?: string;

  @ApiPropertyOptional({
    description: 'Category name',
    example: 'Fruits',
  })
  @IsOptional()
  @IsString()
  category?: string;
}
