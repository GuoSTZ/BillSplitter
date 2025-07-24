import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Bill } from './bill.entity';
import { Person } from '../people/person.entity';

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

  @ManyToOne(() => Person)
  @JoinColumn({ name: 'personId' })
  person: Person;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 1.0 })
  shareRatio: number; // 分摊比例

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  shareAmount: number; // 应分摊金额

  @Column({ type: 'boolean', default: false })
  isPaid: boolean; // 是否已支付
}