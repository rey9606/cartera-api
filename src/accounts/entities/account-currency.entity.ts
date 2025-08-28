import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Account } from './account.entity';

@Entity('account_currencies')
export class AccountCurrency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  accountId: string;

  @ManyToOne(() => Account, (account) => account.accountsCurrencies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @Column({ type: 'varchar', length: 10 }) // e.g., USD, EUR, CUP
  currency: string;

  @Column({ type: 'decimal', precision: 18, scale: 8, default: 0 }) // Use higher precision for currency amounts
  amount: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
