import { Controller, Get } from '@nestjs/common';
import { ExchangeRatesService, ExchangeRateScraped } from './exchange-rates.service';

@Controller('exchange-rates')
export class ExchangeRatesController {
  constructor(private readonly exchangeRatesService: ExchangeRatesService) {}

  @Get()
  async findAll(): Promise<ExchangeRateScraped[]> {
    return this.exchangeRatesService.findAll();
  }
}
