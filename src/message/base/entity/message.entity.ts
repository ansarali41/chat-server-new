import { MessageTypes } from 'src/lib/constant';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chat_id: number;

  @Column()
  sender_id: number;

  @Column({ type: 'text', nullable: true })
  text: string;

  @Column({ type: 'enum', enum: MessageTypes, default: MessageTypes.INITIAL })
  type: MessageTypes;

  @Column()
  app_id: number;

  @Column()
  business_id: number;

  // @Column()
  // user_id: number;

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

  @Column({ type: 'boolean', default: false })
  isRead: boolean;
}
