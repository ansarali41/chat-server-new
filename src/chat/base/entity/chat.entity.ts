import { ChatStatus } from 'src/lib/constant';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sender_id: number;

  @Column({ type: 'int', nullable: true })
  receiver_id: number;

  @Column()
  app_id: number;

  @Column()
  business_id: number;

  @Column()
  user_id: number;

  @Column({ type: 'text' })
  topic: string;

  @Column({ type: 'int' })
  topic_id: number;

  @Column({ type: 'int' })
  asset_id: number;

  @Column({ type: 'int', nullable: true })
  service_job_id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'int', nullable: true })
  createdBy: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'int', nullable: true })
  updatedBy: number;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @Column({ type: 'int', nullable: true })
  deletedBy: number;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @Column({ type: 'enum', enum: ChatStatus, default: ChatStatus.PENDING })
  status: ChatStatus;
}
