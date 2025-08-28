import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

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

  @Column('decimal', { precision: 10, scale: 4, nullable: true }) // Rate of this currency to CUP
  rateToCUP: number;

  @UpdateDateColumn() // Automatically updates on entity save
  updatedAt: Date;
}
