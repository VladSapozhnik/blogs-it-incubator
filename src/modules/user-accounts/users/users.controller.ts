import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './services/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersQueryRepository } from './repositories/users.query.repository';
import { GetUsersQueryParamsDto } from './dto/users-query-input.dto';
import { UsersMapper } from './mappers/users.mapper';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view.dto';
import { SuperAdminAuthGuard } from './guards/super-admin-auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  @Post()
  @UseGuards(SuperAdminAuthGuard)
  async create(@Body() createUserDto: CreateUserDto) {
    const id: string = await this.usersService.createUser(createUserDto);

    return this.usersQueryRepository.getUserById(id);
  }

  @Get()
  @UseGuards(SuperAdminAuthGuard)
  findAll(
    @Query() query: GetUsersQueryParamsDto,
  ): Promise<PaginatedViewDto<UsersMapper[]>> {
    return this.usersQueryRepository.getAllUsers(query);
  }

  @Delete(':id')
  @UseGuards(SuperAdminAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.usersService.removeUser(id);
  }
}
