import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Account } from './entities/account.entity';

@ApiTags('accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new account' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The account has been successfully created.',
    type: Account,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input.' })
  create(@Body() createAccountDto: CreateAccountDto): Promise<Account> {
    return this.accountsService.create(createAccountDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve all accounts' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved all accounts.',
    type: [Account],
  })
  findAll(): Promise<Account[]> {
    return this.accountsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve an account by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the account', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved the account.',
    type: Account,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Account not found.' })
  findOne(@Param('id') id: string): Promise<Account> {
    return this.accountsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an account by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the account', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The account has been successfully updated.',
    type: Account,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Account not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input.' })
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto): Promise<Account> {
    return this.accountsService.update(id, updateAccountDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an account by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the account', type: String })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The account has been successfully deleted.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Account not found.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.accountsService.remove(id);
  }
}