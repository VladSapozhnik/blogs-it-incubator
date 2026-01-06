import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersRepository } from '../repositories/users.repository';
import {
  User,
  UserDocument,
  type UserModelType,
} from '../entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { HashAdapter } from '../../../../core/adapters/hash.adapter';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: UserModelType,
    private readonly usersRepository: UsersRepository,
    private readonly hashAdapter: HashAdapter,
  ) {}

  async createUser(dto: CreateUserDto): Promise<string> {
    await this.usersRepository.findByLoginOrEmail(dto.login, dto.email);

    const hash: string = await this.hashAdapter.hashPassword(dto.password);

    const newUser: UserDocument = this.UserModel.createInstance(dto, hash, {
      confirmationCode: 'superAdmin',
      expirationDate: new Date(),
      isConfirmed: true,
    });

    return this.usersRepository.createUser(newUser);
  }

  async removeUser(id: string) {
    const existUser: UserDocument = await this.usersRepository.getUserById(id);

    await this.usersRepository.removeUser(existUser);
  }
}
