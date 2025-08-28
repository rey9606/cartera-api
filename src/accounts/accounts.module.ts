import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { Account } from './entities/account.entity';
import { AccountCurrency } from './entities/account-currency.entity';
import { Currency } from '../exchange-rates/entities/currency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, AccountCurrency, Currency])],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
