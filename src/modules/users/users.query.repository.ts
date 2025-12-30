import { InjectModel } from '@nestjs/mongoose';
import { User, type UserModelType, UserDocument } from './entities/user.entity';
import { GetUsersQueryParamsDto } from './dto/users-query-input.dto';
import { UsersMapper } from './mappers/users.mapper';
import { PaginatedViewDto } from '../../core/dto/base.paginated.view.dto';
import { NotFoundException } from '@nestjs/common';

export class UsersQueryRepository {
  constructor(
    @InjectModel(User.name) private readonly UserModel: UserModelType,
  ) {}
  async getAllUsers(queryDto: GetUsersQueryParamsDto) {
    const filter = queryDto.buildUserFilter();

    const users: UserDocument[] = await this.UserModel.find(filter)
      .sort({ [queryDto.sortBy]: queryDto.sortDirection, _id: 1 })
      .skip(queryDto.calculateSkip())
      .limit(queryDto.pageSize);

    const totalCount: number = await this.UserModel.countDocuments(filter);

    const items: UsersMapper[] = users.map(UsersMapper.mapToView);

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: queryDto.pageNumber,
      size: queryDto.pageSize,
    });
  }

  async getUserById(id: string): Promise<UsersMapper> {
    const user: UserDocument | null = await this.UserModel.findOne({
      _id: id,
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return UsersMapper.mapToView(user);
  }
}
