import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { BillsService } from './bills.service';
import { CreateBillDto, UpdateBillDto, UpdateParticipantPaymentDto } from './dto/bill.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiResponse } from '../common/dto/response.dto';
import { Bill } from './bill.entity';
import { BillParticipant } from './bill-participant.entity';

@Controller('bills')
@UseGuards(JwtAuthGuard)
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @Post()
  async create(
    @Body() createBillDto: CreateBillDto,
    @Request() req,
  ): Promise<ApiResponse<Bill>> {
    try {
      const bill = await this.billsService.create(createBillDto, req.user.userId);
      return ApiResponse.success(bill, '账单创建成功');
    } catch (error) {
      return ApiResponse.error(null, error.message || '账单创建失败');
    }
  }

  @Get()
  async findAll(@Request() req): Promise<ApiResponse<Bill[]>> {
    try {
      const bills = await this.billsService.findAll(req.user.userId);
      return ApiResponse.success(bills, '获取账单列表成功');
    } catch (error) {
      return ApiResponse.error([], error.message || '获取账单列表失败');
    }
  }

  @Get('statistics')
  async getStatistics(@Request() req): Promise<ApiResponse<any>> {
    try {
      const stats = await this.billsService.getStatistics(req.user.userId);
      return ApiResponse.success(stats, '获取统计信息成功');
    } catch (error) {
      return ApiResponse.error(null, error.message || '获取统计信息失败');
    }
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<ApiResponse<Bill>> {
    try {
      const bill = await this.billsService.findOne(id, req.user.userId);
      return ApiResponse.success(bill, '获取账单详情成功');
    } catch (error) {
      return ApiResponse.error(null, error.message || '获取账单详情失败');
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBillDto: UpdateBillDto,
    @Request() req,
  ): Promise<ApiResponse<Bill>> {
    try {
      const bill = await this.billsService.update(id, updateBillDto, req.user.userId);
      return ApiResponse.success(bill, '账单更新成功');
    } catch (error) {
      return ApiResponse.error(null, error.message || '账单更新失败');
    }
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<ApiResponse<null>> {
    try {
      await this.billsService.remove(id, req.user.userId);
      return ApiResponse.success(null, '账单删除成功');
    } catch (error) {
      return ApiResponse.error(null, error.message || '账单删除失败');
    }
  }

  @Patch(':billId/participants/:participantId/payment')
  async updateParticipantPayment(
    @Param('billId', ParseIntPipe) billId: number,
    @Param('participantId', ParseIntPipe) participantId: number,
    @Body() updateDto: UpdateParticipantPaymentDto,
    @Request() req,
  ): Promise<ApiResponse<BillParticipant>> {
    try {
      const participant = await this.billsService.updateParticipantPayment(
        billId,
        participantId,
        updateDto,
        req.user.userId,
      );
      return ApiResponse.success(participant, '支付状态更新成功');
    } catch (error) {
      return ApiResponse.error(null, error.message || '支付状态更新失败');
    }
  }
}