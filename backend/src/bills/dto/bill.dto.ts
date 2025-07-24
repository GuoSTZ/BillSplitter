import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

// 账单参与者DTO（包含完整的Person信息和分摊比例）
export class BillParticipantDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsNumber()
  shareRatio: number; // 分摊比例
}

// 账单项目参与者DTO
export class BillItemParticipantDto {
  @IsNumber()
  personId: number;
}

// 账单项目DTO
export class BillItemDto {
  @IsString()
  title: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsNumber()
  payerId: number; // 付款人ID（仅存储ID，不关联实体）

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BillItemParticipantDto)
  participants: BillItemParticipantDto[];
}

// 创建账单DTO
export class CreateBillDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BillParticipantDto)
  participants: BillParticipantDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BillItemDto)
  billItems: BillItemDto[];
}

// 更新账单DTO
export class UpdateBillDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BillParticipantDto)
  participants?: BillParticipantDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BillItemDto)
  billItems?: BillItemDto[];
}