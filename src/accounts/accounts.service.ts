import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountCurrency } from './entities/account-currency.entity';
import { AccountCurrencyResponseDto } from './dto/account-currency-response.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
    @InjectRepository(AccountCurrency)
    private accountCurrenciesRepository: Repository<AccountCurrency>,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const { currencies, ...accountData } = createAccountDto;
    const account = this.accountsRepository.create(accountData);
    const savedAccount = await this.accountsRepository.save(account);

    if (currencies && currencies.length > 0) {
      const accountCurrencies = currencies.map(currency =>
        this.accountCurrenciesRepository.create({
          accountId: savedAccount.id,
          currency,
          amount: 0,
        })
      );
      await this.accountCurrenciesRepository.save(accountCurrencies);
      savedAccount.accountsCurrencies = accountCurrencies;
    }

    return this.transformAccount(savedAccount);
  }

  async findAll(): Promise<Account[]> {
    const accounts = await this.accountsRepository.find({ relations: ['accountsCurrencies'] });
    return accounts.map(account => this.transformAccount(account));
  }

  async findOne(id: string): Promise<Account> {
    const account = await this.accountsRepository.findOne({
      where: { id },
      relations: ['accountsCurrencies'],
    });
    if (!account) {
      throw new NotFoundException(`Account with ID "${id}" not found`);
    }
    return this.transformAccount(account);
  }

  async update(id: string, updateAccountDto: UpdateAccountDto): Promise<Account> {
    const { currencies, ...accountData } = updateAccountDto;
    const account = await this.findOne(id);
    this.accountsRepository.merge(account, accountData);
    const updatedAccount = await this.accountsRepository.save(account);

    if (currencies !== undefined) {
      await this.accountCurrenciesRepository.delete({ accountId: id });
      if (currencies && currencies.length > 0) {
        const accountCurrencies = currencies.map(currency =>
          this.accountCurrenciesRepository.create({
            accountId: updatedAccount.id,
            currency,
            amount: 0,
          })
        );
        await this.accountCurrenciesRepository.save(accountCurrencies);
        updatedAccount.accountsCurrencies = accountCurrencies;
      } else {
        updatedAccount.accountsCurrencies = [];
      }
    }

    return this.transformAccount(updatedAccount);
  }

  async remove(id: string): Promise<void> {
    const result = await this.accountsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Account with ID "${id}" not found`);
    }
  }

  private transformAccount(account: Account): Account {
    const transformedAccount: any = { ...account }; // Create a shallow copy

    if (transformedAccount.accountsCurrencies) {
      transformedAccount.currencies = transformedAccount.accountsCurrencies.map(ac => ({
        currency: ac.currency,
        amount: parseFloat(ac.amount.toString()),
      })) as AccountCurrencyResponseDto[];
    } else {
      transformedAccount.currencies = [];
    }
    // Remove the original accountsCurrencies property from the copied object
    delete transformedAccount.accountsCurrencies;
    return transformedAccount;
  }
}
