import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { BillParticipant } from './bill-participant.entity';
import { BillItem } from './bill-item.entity';

@Entity('bills')
export class Bill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // 移除 status 字段，因为不再需要手动管理状态

  @Column()
  createdBy: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  creator: User;

  // 账单级别的参与者（用于存储分摊比例）
  @OneToMany(() => BillParticipant, participant => participant.bill, { cascade: true })
  participants: BillParticipant[];

  // 账单项目
  @OneToMany(() => BillItem, billItem => billItem.bill, { cascade: true })
  billItems: BillItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}