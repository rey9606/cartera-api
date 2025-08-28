import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as cheerio from 'cheerio';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from './entities/currency.entity';
import { ExchangeRate } from './entities/exchange-rate.entity';

export interface ExchangeRateScraped {
  currency: string;
  value: number;
  change?: number;
}

@Injectable()
export class ExchangeRatesService {
  private readonly logger = new Logger(ExchangeRatesService.name);
  private readonly URL = 'https://eltoque.com/';

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,
    @InjectRepository(ExchangeRate)
    private exchangeRateRepository: Repository<ExchangeRate>,
  ) {}

  async findAll(): Promise<ExchangeRateScraped[]> {
    try {
      const response = await lastValueFrom(this.httpService.get(this.URL));
      const html = response.data;
      const $ = cheerio.load(html);

      const scrapedRates: ExchangeRateScraped[] = [];

      // Ensure CUP currency exists (assuming CUP is the base currency for conversion)
      let cupCurrency = await this.currencyRepository.findOne({ where: { code: 'CUP' } });
      if (!cupCurrency) {
        cupCurrency = this.currencyRepository.create({ code: 'CUP', name: 'Cuban Peso', symbol: 'CUP' });
        await this.currencyRepository.save(cupCurrency);
      }

      for (const element of $('tbody tr').get()) {
        const currencyText = $(element).find('.currency').text().trim(); // e.g. "1 USD"
        const valueText = $(element).find('.price-text').text().trim();   // e.g. "409.00 CUP"
        const changeText = $(element).find('.dif-number sup').text().trim(); // e.g. "+4"

        const currencyCode = currencyText.replace('1 ', '');
        const value = parseFloat(valueText.replace('CUP', '').trim());
        const change = changeText ? parseFloat(changeText.replace('+', '')) : undefined;

        if (currencyCode && !isNaN(value)) {
          scrapedRates.push({ currency: currencyCode, value, change });

          // Find or create the 'from' currency
          let fromCurrency = await this.currencyRepository.findOne({ where: { code: currencyCode } });
          if (!fromCurrency) {
            fromCurrency = this.currencyRepository.create({ code: currencyCode, name: currencyCode, symbol: currencyCode }); // Use code as name/symbol for now
            await this.currencyRepository.save(fromCurrency);
          }

          // Create and save the exchange rate
          const newExchangeRate = this.exchangeRateRepository.create({
            fromCurrency: fromCurrency,
            toCurrency: cupCurrency,
            value: value,
            change: change,
          });
          await this.exchangeRateRepository.save(newExchangeRate);
        }
      }

      return scrapedRates;
    } catch (error) {
      this.logger.error('Error al scrapear y guardar tasas de elTOQUE', error);
      return [];
    }
  }
}
