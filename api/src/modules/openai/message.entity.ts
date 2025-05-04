import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SenderType } from '../../common/enums/sender-type.enum';
import { Chat } from './chat.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'enum', enum: SenderType })
  senderType: SenderType;

  @ManyToOne(() => Chat, (chat) => chat.messages, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  chat?: Chat;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
