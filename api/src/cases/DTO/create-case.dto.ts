import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateCaseDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  customerId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  loanId: number;
}