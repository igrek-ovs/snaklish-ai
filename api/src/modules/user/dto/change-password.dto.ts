import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'StrongPass123!', description: 'Новый пароль' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}