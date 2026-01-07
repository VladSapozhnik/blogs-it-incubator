import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  User,
  UserDocument,
  type UserModelType,
} from '../entities/user.entity';
import { ProfileMapper } from '../../auth/mappers/profile.mapper';
import { Types } from 'mongoose';

@Injectable()
export class UsersQueryExternalRepository {
  constructor(
    @InjectModel(User.name) private readonly UserModel: UserModelType,
  ) {}

  async getProfile(id: string): Promise<ProfileMapper> {
    const user: UserDocument | null = await this.UserModel.findOne({
      _id: new Types.ObjectId(id),
    });

    if (!user) {
      throw new UnauthorizedException([
        {
          message: 'Unauthorized',
          field: 'user',
        },
      ]);
    }

    return ProfileMapper.mapToView(user);
  }
}
