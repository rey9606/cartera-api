import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountDto } from './create-account.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {
  @ApiProperty({ description: 'The ID of the user who owns this account', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', required: false })
  @IsOptional()
  @IsString()
  userId?: string;
}
