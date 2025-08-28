import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Currency } from './currency.entity';

@Entity()
export class ExchangeRate {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Currency, currency => currency.sentExchangeRates)
  fromCurrency: Currency;

  @ManyToOne(() => Currency, currency => currency.receivedExchangeRates)
  toCurrency: Currency;

  @Column('decimal', { precision: 10, scale: 4 })
  value: number;

  @Column('decimal', { precision: 10, scale: 4, nullable: true })
  change: number; // Optional, based on scraped data

  @CreateDateColumn()
  createdAt: Date;
}
