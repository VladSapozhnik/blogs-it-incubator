import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, UserDocument, type UserModelType } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly UserModel: UserModelType,
  ) {}

  async getUserById(id: string): Promise<UserDocument> {
    const user: UserDocument | null = await this.UserModel.findOne({
      _id: id,
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  async checkUserDoesNotExist(id: string): Promise<null> {
    const user: UserDocument | null = await this.UserModel.findOne({
      _id: id,
    });

    if (user) {
      throw new BadRequestException('User already exists');
    }

    return user;
  }

  async findByLoginOrEmail(
    login: string,
    email: string,
  ): Promise<UserDocument | null> {
    return this.UserModel.findOne({
      $or: [{ login }, { email }],
    });
  }

  async createUser(user: UserDocument): Promise<string> {
    const result: UserDocument = await user.save();
    return result._id.toString();
  }

  async removeUser(user: UserDocument) {
    await user.deleteOne();
  }
}
