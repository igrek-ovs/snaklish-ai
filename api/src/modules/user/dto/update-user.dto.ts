import { UserRole } from '../user.entity';
import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    example: 'Иван Иванов',
    description: 'Новое имя пользователя',
    required: false,
  })
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Новый Email пользователя',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: 'admin',
    description: 'Новая роль пользователя',
    enum: UserRole,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
