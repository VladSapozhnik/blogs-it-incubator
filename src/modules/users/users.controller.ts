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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersQueryRepository } from './users.query.repository';
import { GetUsersQueryParamsDto } from './dto/users-query-input.dto';
import { PaginatedViewDto } from '../../core/dto/base.paginated.view.dto';
import { UsersMapper } from './mappers/users.mapper';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const id: string = await this.usersService.createUser(createUserDto);

    return this.usersQueryRepository.getUserById(id);
  }

  @Get()
  findAll(
    @Query() query: GetUsersQueryParamsDto,
  ): Promise<PaginatedViewDto<UsersMapper[]>> {
    return this.usersQueryRepository.getAllUsers(query);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.usersService.removeUser(id);
  }
}
