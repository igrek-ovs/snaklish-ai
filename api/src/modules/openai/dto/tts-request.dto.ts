import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TtsRequestDto {
  @ApiProperty({
    description: 'Текст для озвучки',
    example: 'Hello! How are you today?',
  })
  @IsString()
  text: string;
}
