import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateChatDto {
  @ApiProperty({ description: 'Название чата' })
  @IsString()
  title: string;
}
