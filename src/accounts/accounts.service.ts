import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountCurrency } from './entities/account-currency.entity';
import { AccountCurrencyResponseDto } from './dto/account-currency-response.dto';
import { Currency } from '../exchange-rates/entities/currency.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
    @InjectRepository(AccountCurrency)
    private accountCurrenciesRepository: Repository<AccountCurrency>,
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const account = this.accountsRepository.create(createAccountDto);
    const savedAccount = await this.accountsRepository.save(account);

    // Fetch all available currencies
    const allCurrencies = await this.currencyRepository.find();

    if (allCurrencies.length > 0) {
      const accountCurrencies: AccountCurrency[] = [];
      for (const currencyEntity of allCurrencies) {
        accountCurrencies.push(
          (() => {
            const newAccountCurrencyData: Partial<AccountCurrency> = {
              accountId: savedAccount.id,
              currency: currencyEntity,
              amount: 0,
            };
            const newAccountCurrency = new AccountCurrency();
            Object.assign(newAccountCurrency, newAccountCurrencyData);
            return newAccountCurrency;
          })()
        );
      }
      await this.accountCurrenciesRepository.save(accountCurrencies);
      savedAccount.accountsCurrencies = accountCurrencies;
    }

    return this.transformAccount(savedAccount);
  }

  async findAll(): Promise<Account[]> {
    const accounts = await this.accountsRepository.find({ relations: ['accountsCurrencies', 'accountsCurrencies.currency'] });
    return accounts.map(account => this.transformAccount(account));
  }

  async findOne(id: string): Promise<Account> {
    const account = await this.accountsRepository.findOne({
      where: { id },
      relations: ['accountsCurrencies', 'accountsCurrencies.currency'],
    });
    if (!account) {
      throw new NotFoundException(`Account with ID "${id}" not found`);
    }
    return this.transformAccount(account);
  }

  async update(id: string, updateAccountDto: UpdateAccountDto): Promise<Account> {
    const account = await this.findOne(id);
    this.accountsRepository.merge(account, updateAccountDto);
    const updatedAccount = await this.accountsRepository.save(account);

    return this.transformAccount(updatedAccount);
  }

  async remove(id: string): Promise<void> {
    const result = await this.accountsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Account with ID "${id}" not found`);
    }
  }

  private transformAccount(account: Account): Account {
    const transformedAccount: any = { ...account };

    if (transformedAccount.accountsCurrencies) {
      transformedAccount.currencies = transformedAccount.accountsCurrencies.map(ac => ({
        currency: ac.currency.code,
        amount: parseFloat(ac.amount.toString()),
      }));
    } else {
      transformedAccount.currencies = [];
    }
    delete transformedAccount.accountsCurrencies;
    return transformedAccount;
  }
}
