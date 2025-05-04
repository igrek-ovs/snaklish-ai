import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ChatRequestDto {
  @ApiProperty({
    description: 'Сообщение пользователя',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Кастомное системное сообщение (по желанию)',
    required: false,
    default: '',
  })
  @IsOptional()
  @IsString()
  systemPrompt?: string;
}
