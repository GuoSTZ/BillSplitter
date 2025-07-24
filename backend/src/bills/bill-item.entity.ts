import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Bill } from './bill.entity';
import { BillItemParticipant } from './bill-item-participant.entity';

@Entity('bill_items')
export class BillItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  billId: number;

  @ManyToOne(() => Bill, bill => bill.billItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'billId' })
  bill: Bill;

  @Column()
  title: string;

  @Column({ type: 'float' })
  amount: number;

  @Column()
  payerId: number;

  @OneToMany(() => BillItemParticipant, participant => participant.billItem, { cascade: true })
  participants: BillItemParticipant[];
}