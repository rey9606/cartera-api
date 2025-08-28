import { ApiProperty } from '@nestjs/swagger';

export class AccountCurrencyResponseDto {
  @ApiProperty({ description: 'The currency code (e.g., USD, EUR)', example: 'USD' })
  currency: string;

  @ApiProperty({ description: 'The amount in this currency', example: 1000.00 })
  amount: number;
}
