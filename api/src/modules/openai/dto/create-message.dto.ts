import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { SenderType } from '../../../common/enums/sender-type.enum';

export class CreateMessageDto {
  @ApiProperty({ description: 'Текст сообщения' })
  @IsString()
  content: string;

  @ApiProperty({ enum: SenderType, description: 'Тип отправителя' })
  @IsEnum(SenderType)
  senderType: SenderType;
}
