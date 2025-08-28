import { Controller, Get } from '@nestjs/common';
import { ExchangeRatesService, ExchangeRateScraped } from './exchange-rates.service';

export interface ExchangeRatesResponseDto {
  timestamp: Date;
  rates: ExchangeRateScraped[];
}

@Controller('exchange-rates')
export class ExchangeRatesController {
  constructor(private readonly exchangeRatesService: ExchangeRatesService) {}

  @Get()
  async findAll(): Promise<ExchangeRatesResponseDto> {
    const rates = await this.exchangeRatesService.findAll();
    return {
      timestamp: new Date(),
      rates: rates,
    };
  }
}
