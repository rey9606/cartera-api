import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as cheerio from 'cheerio';

export interface ExchangeRate {
  currency: string;
  value: number;
  change?: number;
}

@Injectable()
export class ExchangeRatesService {
  private readonly logger = new Logger(ExchangeRatesService.name);
  private readonly URL = 'https://eltoque.com/';

  constructor(private readonly httpService: HttpService) {}

  async findAll(): Promise<ExchangeRate[]> {
    try {
      const response = await lastValueFrom(this.httpService.get(this.URL));
      const html = response.data;
      const $ = cheerio.load(html);

      const rates: ExchangeRate[] = [];

      $('tbody tr').each((_, element) => {
        const currencyText = $(element).find('.currency').text().trim(); // e.g. "1 USD"
        const valueText = $(element).find('.price-text').text().trim();   // e.g. "409.00 CUP"
        const changeText = $(element).find('.dif-number sup').text().trim(); // e.g. "+4"

        const currency = currencyText.replace('1 ', '');
        const value = parseFloat(valueText.replace('CUP', '').trim());
        const change = changeText ? parseFloat(changeText.replace('+', '')) : undefined;

        if (currency && !isNaN(value)) {
          rates.push({ currency, value, change });
        }
      });

      return rates;
    } catch (error) {
      this.logger.error('Error al scrapear tasas de elTOQUE', error);
      return [];
    }
  }
}
