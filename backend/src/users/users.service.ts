import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findById(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(userData: { username: string; password: string; email: string; name?: string }): Promise<User> {
    const user = new User();
    user.username = userData.username;
    user.email = userData.email;
    user.name = userData.name || null;

    // 对密码进行哈希处理
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(userData.password, salt);

    return this.usersRepository.save(user);
  }

  async getUserProfile(id: number): Promise<Omit<User, 'password'>> {
    const user = await this.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    // 排除密码字段
    const { password, ...result } = user;
    return result;
  }
}