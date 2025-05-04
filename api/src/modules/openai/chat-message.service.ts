import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';
import { Message } from './message.entity';
import { User } from '../user/user.entity';
import { SenderType } from '../../common/enums/sender-type.enum';

@Injectable()
export class ChatMessageService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,

    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createChat(userId: string, title: string): Promise<Chat> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    const chat = this.chatRepository.create({
      title,
      user,
    });
    return await this.chatRepository.save(chat);
  }

  async findChatsByUserId(userId: string): Promise<Chat[]> {
    const chats = await this.chatRepository.find({
      where: { user: { id: userId } },
      relations: ['messages'],
      order: { createdAt: 'DESC' },
    });
    return chats;
  }

  async findChatById(chatId: number): Promise<Chat> {
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['messages', 'user'],
    });
    if (!chat) throw new NotFoundException('Chat not found');
    return chat;
  }

  async deleteChat(chatId: number): Promise<void> {
    const result = await this.chatRepository.delete(chatId);
    if (result.affected === 0) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }
  }

  async createMessage(
    chatId: number,
    content: string,
    senderType: SenderType,
  ): Promise<Message> {
    const chat = await this.chatRepository.findOne({ where: { id: chatId } });
    if (!chat) throw new NotFoundException('Chat not found');

    const message = this.messageRepository.create({
      content,
      senderType,
      chat,
    });

    return await this.messageRepository.save(message);
  }

  async deleteMessage(messageId: number): Promise<void> {
    const result = await this.messageRepository.delete(messageId);
    if (result.affected === 0) {
      throw new NotFoundException(`Message with ID ${messageId} not found`);
    }
  }

  async getMessagesByChat(chatId: number): Promise<Message[]> {
    const messages = await this.messageRepository.find({
      where: { chat: { id: chatId } },
      order: { createdAt: 'ASC' },
    });
    return messages;
  }

  async getLastMessagesByChat(chatId: number, limit = 15): Promise<Message[]> {
    const messages = await this.messageRepository.find({
      where: { chat: { id: chatId } },
      order: { createdAt: 'DESC' }, // сначала достаём последние (DESC)
      take: limit,
    });

    return messages.sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    );
  }
}
