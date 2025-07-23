import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { ApiResponse } from '../common/dto/response.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<ApiResponse<any>> {
    try {
      const profile = await this.usersService.getUserProfile(req.user.userId);
      return ApiResponse.success(profile, '获取用户信息成功');
    } catch (error) {
      return ApiResponse.error(null, error.message || '获取用户信息失败');
    }
  }
}