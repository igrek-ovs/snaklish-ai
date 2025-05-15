import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, ValidateIf } from 'class-validator';

export class SearchCategoriesDto {
  @ApiPropertyOptional({ description: 'ID of the category', example: 123 })
  @IsOptional()
  @ValidateIf((o) => o.id !== undefined)
  @Type(() => Number)
  @IsNumber({}, { message: 'id must be a number' })
  id?: number;

  @ApiPropertyOptional({
    description: 'Name of the category',
    example: 'Fruits',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Description',
    example: 'All kinds of fruits',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
