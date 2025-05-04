import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChatMessageService } from './chat-message.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateChatDto } from './dto/create-chat.dto';

@ApiTags('Chats & Messages')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('chats')
export class ChatMessageController {
  constructor(private readonly chatMessageService: ChatMessageService) {}

  @ApiOperation({ summary: 'Создать новый чат' })
  @Post()
  async createChat(@Req() req, @Body() dto: CreateChatDto) {
    return this.chatMessageService.createChat(req.user.id, dto.title);
  }

  @ApiOperation({ summary: 'Получить все чаты пользователя' })
  @Get()
  async getUserChats(@Req() req) {
    return this.chatMessageService.findChatsByUserId(req.user.id);
  }

  @ApiOperation({ summary: 'Получить чат по ID' })
  @Get(':chatId')
  async getChatById(@Param('chatId') chatId: number) {
    return this.chatMessageService.findChatById(chatId);
  }

  @ApiOperation({ summary: 'Удалить чат по ID' })
  @Delete(':chatId')
  async deleteChat(@Param('chatId') chatId: number) {
    await this.chatMessageService.deleteChat(chatId);
    return { message: 'Chat deleted successfully' };
  }

  @ApiOperation({ summary: 'Создать сообщение в чате' })
  @Post(':chatId/messages')
  async createMessage(
    @Param('chatId') chatId: number,
    @Body() dto: CreateMessageDto,
  ) {
    return this.chatMessageService.createMessage(
      chatId,
      dto.content,
      dto.senderType,
    );
  }

  @ApiOperation({ summary: 'Получить сообщения чата' })
  @Get(':chatId/messages')
  async getMessagesByChat(@Param('chatId') chatId: number) {
    return this.chatMessageService.getMessagesByChat(chatId);
  }

  @ApiOperation({ summary: 'Удалить сообщение по ID' })
  @Delete('messages/:messageId')
  async deleteMessage(@Param('messageId') messageId: number) {
    await this.chatMessageService.deleteMessage(messageId);
    return { message: 'Message deleted successfully' };
  }
}
