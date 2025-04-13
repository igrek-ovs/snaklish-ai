import { UserRole } from '../user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserResultDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Уникальный идентификатор пользователя',
  })
  id: string;

  @ApiProperty({ example: 'Иван Иванов', description: 'Имя пользователя' })
  name: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  email: string;

  @ApiProperty({ example: true, description: 'Флаг подтверждения email' })
  isEmailConfirmed: boolean;

  @ApiProperty({
    example: 'user',
    description: 'Роль пользователя',
    enum: UserRole,
  })
  role: UserRole;
}
