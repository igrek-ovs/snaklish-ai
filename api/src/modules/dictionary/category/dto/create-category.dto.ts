import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiPropertyOptional({
    description: 'Название категории',
    example: 'Животные',
  })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiPropertyOptional({
    description: 'Описание категории',
    example: 'Категория для различных имен животных.',
  })
  @IsOptional()
  @IsString()
  readonly description?: string;
}
