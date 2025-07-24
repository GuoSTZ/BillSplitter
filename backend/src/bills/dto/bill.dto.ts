import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, Min, IsEnum, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class BillParticipantDto {
  @IsNumber()
  personId: number;

  @IsNumber()
  @Min(0)
  shareRatio: number;
}

export class CreateBillDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  totalAmount: number;

  @IsNumber()
  payerId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BillParticipantDto)
  participants: BillParticipantDto[];
}

export class UpdateBillDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalAmount?: number;

  @IsOptional()
  @IsNumber()
  payerId?: number;

  @IsOptional()
  @IsEnum(['pending', 'settled', 'cancelled'])
  status?: 'pending' | 'settled' | 'cancelled';

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BillParticipantDto)
  participants?: BillParticipantDto[];
}

export class UpdateParticipantPaymentDto {
  @IsBoolean()
  isPaid: boolean;
}