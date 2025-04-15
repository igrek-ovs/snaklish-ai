import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh токен для получения нового access токена',
    example: 'some-long-refresh-token-string',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
