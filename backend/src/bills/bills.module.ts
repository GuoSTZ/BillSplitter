import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillsService } from './bills.service';
import { BillsController } from './bills.controller';
import { Bill } from './bill.entity';
import { BillParticipant } from './bill-participant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bill, BillParticipant])],
  controllers: [BillsController],
  providers: [BillsService],
  exports: [BillsService],
})
export class BillsModule {}