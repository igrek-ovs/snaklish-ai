import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetAuditLogsDto {
  @ApiPropertyOptional({
    description:
      'IP-адреса користувача для фільтрації (частковий або повний збіг)',
    example: '192.168.1.1',
  })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional({
    description: 'HTTP метод для фільтрації (GET, POST, PUT, DELETE)',
    example: 'POST',
  })
  @IsOptional()
  @IsString()
  method?: string;

  @ApiPropertyOptional({
    description: 'HTTP статус код відповіді (наприклад: 200, 404, 500)',
    example: 200,
  })
  @IsOptional()
  @IsNumber()
  statusCode?: number;

  @ApiPropertyOptional({
    description: 'Дата з якої почати фільтрацію (у форматі ISO 8601)',
    example: '2024-05-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({
    description: 'Дата до якої фільтрувати (у форматі ISO 8601)',
    example: '2024-05-31T23:59:59.999Z',
  })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional({
    description: 'User email',
    example: 'admin@admin.com',
  })
  @IsOptional()
  @IsString()
  userEmail?: string;
}
