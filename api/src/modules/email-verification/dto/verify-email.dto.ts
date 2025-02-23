import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({ example: '123456', description: 'Код подтверждения email' })
  @IsString()
  @Length(6, 6)
  code: string;
}
