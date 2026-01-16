import { HttpStatus, Injectable } from '@nestjs/common';
import { HashAdapter } from '../../../core/adapters/hash.adapter';
import { generateId } from '../../../core/helpers/generate-id';
import {
  User,
  UserDocument,
  type UserModelType,
} from '../users/entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { add } from 'date-fns/add';
import { EmailAdapter } from '../../../core/adapters/email.adapter';
import { emailExamples } from '../../../core/adapters/email.examples';
import { UsersExternalRepository } from '../users/repositories/users.external.repository';
import { AccessAndRefreshTokensType } from './types/access-and-refresh-tokens.type';
import { PasswordRecoveryExternalRepository } from '../password-recovery/password-recovery.external.repository';
import {
  PasswordRecovery,
  PasswordRecoveryDocument,
  type PasswordRecoveryModel,
} from '../password-recovery/entities/password-recovery.entity';
import { JwtPayload } from '../../../core/types/jwt-payload.type';
import { JwtAdapter } from '../../../core/adapters/jwt.adapter';
import { NewPasswordDto } from './dto/new-password.dto';
import { DomainException } from '../../../core/exceptions/domain-exceptions';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: UserModelType,
    @InjectModel(PasswordRecovery.name)
    private readonly PasswordRecoveryModel: PasswordRecoveryModel,
    private readonly usersExternalRepository: UsersExternalRepository,
    private readonly passwordRecoveryExternalRepository: PasswordRecoveryExternalRepository,
    private readonly hashAdapter: HashAdapter,
    private readonly jwtAdapter: JwtAdapter,
    private readonly emailAdapter: EmailAdapter,
  ) {}

  async resendEmail(email: string) {
    const newExpiration: Date = add(new Date(), { hours: 1, minutes: 30 });
    const newCode = generateId();

    const user: UserDocument =
      await this.usersExternalRepository.findUserByEmail(email);

    if (user.emailConfirmation.isConfirmed) {
      throw new DomainException({
        status: HttpStatus.BAD_REQUEST,
        errorsMessages: [
          {
            message: 'Email already confirmed',
            field: 'email',
          },
        ],
      });
    }

    user.resendEmail(newCode, newExpiration);

    await this.usersExternalRepository.save(user);

    try {
      await this.emailAdapter.sendEmail(
        email,
        newCode,
        emailExamples.registrationEmail,
      );
    } catch (e) {
      console.log(e);
    }
  }

  async refreshToken(payload: JwtPayload): Promise<AccessAndRefreshTokensType> {
    const accessToken: string = await this.jwtAdapter.createAccessToken(
      payload.userId,
    );
    const refreshToken: string = await this.jwtAdapter.createRefreshToken(
      payload.userId,
      payload.deviceId!,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout() {}

  async passwordRecovery(email: string) {
    const randomUUID = generateId();

    const existUser: UserDocument =
      await this.usersExternalRepository.findUserByEmail(email);

    if (existUser) {
      const recoveryData: PasswordRecoveryDocument =
        this.PasswordRecoveryModel.createForUser(existUser._id.toString());

      try {
        await this.emailAdapter.sendEmail(
          email,
          randomUUID,
          emailExamples.passwordRecovery,
        );

        await this.passwordRecoveryExternalRepository.addPasswordRecoveryCode(
          recoveryData,
        );
      } catch (e) {
        console.log(e);
      }
    }
  }

  async newPassword(dto: NewPasswordDto) {
    const passwordRecovery: PasswordRecoveryDocument =
      await this.passwordRecoveryExternalRepository.findPasswordRecoveryByCode(
        dto.recoveryCode,
      );

    passwordRecovery.validateRecoveryCode();

    const hash: string = await this.hashAdapter.hashPassword(dto.newPassword);

    const existUser: UserDocument | null =
      await this.usersExternalRepository.getUserById(
        passwordRecovery.userId.toString(),
      );

    if (!existUser) {
      throw new DomainException({
        status: HttpStatus.BAD_REQUEST,
        errorsMessages: [
          {
            message: 'Bad request',
            field: 'id',
          },
        ],
      });
    }

    existUser.setPassword(hash);

    await this.usersExternalRepository.save(existUser);

    passwordRecovery.markAsUsed();

    await this.passwordRecoveryExternalRepository.markAsUsedById(
      passwordRecovery,
    );
  }
}
