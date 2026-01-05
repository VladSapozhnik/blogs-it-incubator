import {
  PasswordRecovery,
  PasswordRecoveryDocument,
  type PasswordRecoveryModel,
} from './entities/password-recovery.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PasswordRecoveryExternalRepository {
  constructor(
    @InjectModel(PasswordRecovery.name)
    private readonly PasswordRecoveryModel: PasswordRecoveryModel,
  ) {}
  async addPasswordRecoveryCode(
    passwordRecovery: PasswordRecoveryDocument,
  ): Promise<string> {
    await passwordRecovery.save();

    return passwordRecovery._id.toString();
  }

  async getPasswordRecoveryByCode(
    recoveryCode: string,
  ): Promise<PasswordRecoveryDocument | null> {
    return this.PasswordRecoveryModel.findOne({
      recoveryCode,
    });
  }

  async markAsUsedById(
    passwordRecovery: PasswordRecoveryDocument,
  ): Promise<string> {
    await passwordRecovery.save();

    return passwordRecovery._id.toString();
  }
}
