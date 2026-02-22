import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateActionDto {
  @ApiProperty({ example: 'CALL' })
  @IsString()
  type: string;

  @ApiProperty({ example: 'PROMISE_TO_PAY' })
  @IsString()
  outcome: string;

  @ApiProperty({ example: 'Customer promised to pay before end of the day' })
  @IsString()
  notes: string;
}