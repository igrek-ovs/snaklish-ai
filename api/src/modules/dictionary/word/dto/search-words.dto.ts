import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsInt, Min } from 'class-validator';

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

  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNumber: number = 1;

  @ApiPropertyOptional({
    description: 'Page size',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize: number = 10;
}
