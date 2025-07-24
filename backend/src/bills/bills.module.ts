import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillsService } from './bills.service';
import { BillsController } from './bills.controller';
import { Bill } from './bill.entity';
import { BillParticipant } from './bill-participant.entity';
import { BillItem } from './bill-item.entity';
import { BillItemParticipant } from './bill-item-participant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Bill, 
      BillParticipant, 
      BillItem, 
      BillItemParticipant
    ])
  ],
  controllers: [BillsController],
  providers: [BillsService],
})
export class BillsModule {}