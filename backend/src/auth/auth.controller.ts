import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse } from '../common/dto/response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }): Promise<ApiResponse<{ access_token: string }>> {
    try {
      const user = await this.authService.validateUser(loginDto.username, loginDto.password);
      if (!user) {
        return ApiResponse.error(null, '用户名或密码错误');
      }
      const result = await this.authService.login(user);
      return ApiResponse.success(result, '登录成功');
    } catch (error) {
      return ApiResponse.error(null, error.message || '登录失败');
    }
  }

  @Post('register')
  async register(@Body() registerDto: { username: string; password: string; email: string; name?: string }): Promise<ApiResponse<{ access_token: string }>> {
    try {
      const result = await this.authService.register({
        username: registerDto.username,
        password: registerDto.password,
        email: registerDto.email,
        name: registerDto.name,
      });
      return ApiResponse.success(result, '注册成功');
    } catch (error) {
      return ApiResponse.error(null, error.message || '注册失败');
    }
  }
}