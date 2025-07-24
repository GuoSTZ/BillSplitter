import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Bill } from './bill.entity';

@Entity('bill_participants')
export class BillParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  billId: number;

  @ManyToOne(() => Bill, bill => bill.participants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'billId' })
  bill: Bill;

  @Column()
  personId: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 1.0 })
  @Column({ type: 'float', default: 1.0 })
  shareRatio: number; // 分摊比例
}