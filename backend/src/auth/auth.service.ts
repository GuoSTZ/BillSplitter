import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
      },
    };
  }

  async register(userData: { username: string; password: string; email: string; name?: string }) {
    // 检查用户名是否已存在
    const existingUser = await this.usersService.findOne(userData.username);
    if (existingUser) {
      throw new UnauthorizedException('Username already exists');
    }

    // 创建新用户
    const newUser = await this.usersService.create(userData);
    const { password, ...result } = newUser;
    
    // 生成 JWT token
    return this.login(result);
  }
}