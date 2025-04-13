import { UserRole } from '../user.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';

export class UserDto {
  @ApiProperty({ example: 'Иван Иванов', description: 'Имя пользователя' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'StrongPass123!',
    description: 'Пароль пользователя (не хешированный)',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
