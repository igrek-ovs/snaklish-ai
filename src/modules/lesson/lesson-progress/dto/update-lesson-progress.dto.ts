import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLessonProgressDto {
  @ApiPropertyOptional({ example: true, description: 'Флаг завершения урока' })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
