import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BillItem } from './bill-item.entity';

@Entity('bill_item_participants')
export class BillItemParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  billItemId: number;

  @ManyToOne(() => BillItem, billItem => billItem.participants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'billItemId' })
  billItem: BillItem;

  @Column()
  personId: number;

  @Column({ type: 'float', default: 1.0 })
  shareRatio: number; // 分摊比例

  @Column({ type: 'float' })
  shareAmount: number; // 应分摊金额
}