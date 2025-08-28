import { IsString, IsNotEmpty, IsArray, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AccountStatus } from '../entities/account.entity';

export class CreateAccountDto {
  @ApiProperty({ description: 'The name of the account', example: 'My Savings Account' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'A brief description of the account', required: false, example: 'Account for personal savings' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'An array of categories for the account (e.g., ["Personal", "Investment"])',
    type: [String],
    example: ['Personal', 'Investment'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @ApiProperty({
    description: 'The status of the account',
    enum: AccountStatus,
    example: AccountStatus.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(AccountStatus)
  status?: AccountStatus;

  @ApiProperty({ description: 'The ID of the user who owns this account', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}