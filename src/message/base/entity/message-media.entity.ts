import { MessageTypes } from 'src/lib/constant';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class MessageMedia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chat_id: number;

  @Column()
  message_id: number;

  @Column()
  sender_id: number;

  @Column()
  app_id: number;

  @Column()
  business_id: number;

  @Column({ type: 'enum', enum: MessageTypes, default: MessageTypes.INITIAL })
  type: MessageTypes;

  @Column({ type: 'text' })
  url: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'int', nullable: true })
  createdBy: number;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @Column({ type: 'int', nullable: true })
  deletedBy: number;
}
