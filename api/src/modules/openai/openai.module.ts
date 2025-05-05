import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { OpenaiController } from './openai.controller';
import { ChatMessageService } from './chat-message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './chat.entity';
import { Message } from './message.entity';
import { User } from '../user/user.entity';
import { ChatMessageController } from './chat-message.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Message, User])],
  controllers: [OpenaiController, ChatMessageController],
  providers: [OpenaiService, ChatMessageService],
  exports: [OpenaiService],
})
export class OpenaiModule {}
