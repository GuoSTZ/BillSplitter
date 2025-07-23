import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { PeopleService } from './people.service';
import { CreatePersonDto, UpdatePersonDto } from './dto/person.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiResponse } from '../common/dto/response.dto';
import { Person } from './person.entity';

@Controller('people')
@UseGuards(JwtAuthGuard)
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Post()
  async create(@Body() createPersonDto: CreatePersonDto, @Request() req): Promise<ApiResponse<Person>> {
    try {
      const person = await this.peopleService.create(createPersonDto, req.user.userId);
      return ApiResponse.success(person, '人员添加成功');
    } catch (error) {
      return ApiResponse.error(null, error.message || '人员添加失败');
    }
  }

  @Get()
  async findAll(@Request() req): Promise<ApiResponse<Person[]>> {
    try {
      const people = await this.peopleService.findAll(req.user.userId);
      return ApiResponse.success(people, '获取人员列表成功');
    } catch (error) {
      return ApiResponse.error([], error.message || '获取人员列表失败');
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<ApiResponse<Person>> {
    try {
      const person = await this.peopleService.findOne(id, req.user.userId);
      return ApiResponse.success(person, '获取人员信息成功');
    } catch (error) {
      return ApiResponse.error(null, error.message || '获取人员信息失败');
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePersonDto: UpdatePersonDto,
    @Request() req,
  ): Promise<ApiResponse<Person>> {
    try {
      const person = await this.peopleService.update(id, updatePersonDto, req.user.userId);
      return ApiResponse.success(person, '人员更新成功');
    } catch (error) {
      return ApiResponse.error(null, error.message || '人员更新失败');
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<ApiResponse<null>> {
    try {
      await this.peopleService.remove(id, req.user.userId);
      return ApiResponse.success(null, '人员删除成功');
    } catch (error) {
      return ApiResponse.error(null, error.message || '人员删除失败');
    }
  }
}