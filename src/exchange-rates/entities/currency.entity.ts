import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ExchangeRate } from './exchange-rate.entity';

@Entity()
export class Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string; // e.g., USD, EUR, CUP

  @Column()
  name: string; // e.g., US Dollar, Euro, Cuban Peso

  @Column({ nullable: true })
  symbol: string; // e.g., $, €, CUP

  @OneToMany(() => ExchangeRate, exchangeRate => exchangeRate.fromCurrency)
  sentExchangeRates: ExchangeRate[];

  @OneToMany(() => ExchangeRate, exchangeRate => exchangeRate.toCurrency)
  receivedExchangeRates: ExchangeRate[];
}
