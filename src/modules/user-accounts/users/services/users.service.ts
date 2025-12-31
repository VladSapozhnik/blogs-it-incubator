import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersRepository } from '../repositories/users.repository';
import {
  User,
  UserDocument,
  type UserModelType,
} from '../entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: UserModelType,
    private readonly usersRepository: UsersRepository,
  ) {}

  async createUser(dto: CreateUserDto): Promise<string> {
    const user: UserDocument | null =
      await this.usersRepository.findByLoginOrEmail(dto.login, dto.email);

    if (user) {
      throw new BadRequestException('User already exists');
    }

    const newUser: UserDocument = this.UserModel.createInstance(dto);

    return this.usersRepository.createUser(newUser);
  }

  async removeUser(id: string) {
    const existUser: UserDocument = await this.usersRepository.getUserById(id);

    await this.usersRepository.removeUser(existUser);
  }
}
