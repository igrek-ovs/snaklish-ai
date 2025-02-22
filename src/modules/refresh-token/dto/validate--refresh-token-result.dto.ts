import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../user/user.entity';

export class RefreshTokenPayloadDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID пользователя' })
  id: string;

  @ApiProperty({ example: 'user', description: 'Роль пользователя', enum: UserRole })
  role: UserRole;
}