import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async findOne(username: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { username } });
    return user || undefined;
  }
}

