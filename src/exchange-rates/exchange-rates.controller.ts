import { Controller, Get } from '@nestjs/common';
import { ExchangeRatesService, ExchangeRate } from './exchange-rates.service';

@Controller('exchange-rates')
export class ExchangeRatesController {
  constructor(private readonly exchangeRatesService: ExchangeRatesService) {}

  @Get()
  async findAll(): Promise<ExchangeRate[]> {
    return this.exchangeRatesService.findAll();
  }
}
