import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill } from './bill.entity';
import { BillParticipant } from './bill-participant.entity';
import { CreateBillDto, UpdateBillDto, UpdateParticipantPaymentDto } from './dto/bill.dto';

@Injectable()
export class BillsService {
  constructor(
    @InjectRepository(Bill)
    private billsRepository: Repository<Bill>,
    @InjectRepository(BillParticipant)
    private participantsRepository: Repository<BillParticipant>,
  ) {}

  async create(createBillDto: CreateBillDto, userId: number): Promise<Bill> {
    const { participants, ...billData } = createBillDto;
    
    // 验证分摊比例总和
    const totalRatio = participants.reduce((sum, p) => sum + p.shareRatio, 0);
    if (totalRatio <= 0) {
      throw new BadRequestException('分摊比例总和必须大于0');
    }

    // 创建账单
    const bill = this.billsRepository.create({
      ...billData,
      createdBy: userId,
    });
    const savedBill = await this.billsRepository.save(bill);

    // 计算并创建参与者记录
    const participantEntities = participants.map(p => {
      const shareAmount = (createBillDto.totalAmount * p.shareRatio) / totalRatio;
      return this.participantsRepository.create({
        billId: savedBill.id,
        personId: p.personId,
        shareRatio: p.shareRatio,
        shareAmount: Math.round(shareAmount * 100) / 100, // 保留两位小数
        isPaid: false,
      });
    });

    await this.participantsRepository.save(participantEntities);

    return this.findOne(savedBill.id, userId);
  }

  async findAll(userId: number): Promise<Bill[]> {
    return this.billsRepository.find({
      where: { createdBy: userId },
      relations: ['participants', 'participants.person', 'payer'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Bill> {
    const bill = await this.billsRepository.findOne({
      where: { id, createdBy: userId },
      relations: ['participants', 'participants.person', 'payer'],
    });

    if (!bill) {
      throw new NotFoundException('账单不存在');
    }

    return bill;
  }

  async update(id: number, updateBillDto: UpdateBillDto, userId: number): Promise<Bill> {
    const bill = await this.findOne(id, userId);
    const { participants, ...updateData } = updateBillDto;

    // 更新账单基本信息
    Object.assign(bill, updateData);
    await this.billsRepository.save(bill);

    // 如果更新了参与者或金额，重新计算分摊
    if (participants || updateBillDto.totalAmount) {
      await this.participantsRepository.delete({ billId: id });
      
      const newParticipants = participants || bill.participants.map(p => ({
        personId: p.personId,
        shareRatio: p.shareRatio,
      }));
      
      const totalAmount = updateBillDto.totalAmount || bill.totalAmount;
      const totalRatio = newParticipants.reduce((sum, p) => sum + p.shareRatio, 0);
      
      const participantEntities = newParticipants.map(p => {
        const shareAmount = (totalAmount * p.shareRatio) / totalRatio;
        return this.participantsRepository.create({
          billId: id,
          personId: p.personId,
          shareRatio: p.shareRatio,
          shareAmount: Math.round(shareAmount * 100) / 100,
          isPaid: false,
        });
      });

      await this.participantsRepository.save(participantEntities);
    }

    return this.findOne(id, userId);
  }

  async remove(id: number, userId: number): Promise<void> {
    const bill = await this.findOne(id, userId);
    await this.billsRepository.remove(bill);
  }

  async updateParticipantPayment(
    billId: number,
    participantId: number,
    updateDto: UpdateParticipantPaymentDto,
    userId: number,
  ): Promise<BillParticipant> {
    // 验证账单所有权
    await this.findOne(billId, userId);
    
    const participant = await this.participantsRepository.findOne({
      where: { id: participantId, billId },
      relations: ['person'],
    });

    if (!participant) {
      throw new NotFoundException('参与者不存在');
    }

    participant.isPaid = updateDto.isPaid;
    return this.participantsRepository.save(participant);
  }

  async getStatistics(userId: number): Promise<any> {
    const bills = await this.findAll(userId);
    
    const totalBills = bills.length;
    const totalAmount = bills.reduce((sum, bill) => sum + Number(bill.totalAmount), 0);
    const settledBills = bills.filter(bill => bill.status === 'settled').length;
    const pendingBills = bills.filter(bill => bill.status === 'pending').length;
    
    return {
      totalBills,
      totalAmount: Math.round(totalAmount * 100) / 100,
      settledBills,
      pendingBills,
      averageAmount: totalBills > 0 ? Math.round((totalAmount / totalBills) * 100) / 100 : 0,
    };
  }
}