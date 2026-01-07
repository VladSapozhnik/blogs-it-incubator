import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegistrationDto } from './dto/registration.dto';
import { HashAdapter } from '../../../core/adapters/hash.adapter';
import { randomUUID } from 'node:crypto';
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
import { LoginDto } from './dto/login.dto';
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

  async registration(dto: RegistrationDto) {
    const hash: string = await this.hashAdapter.hashPassword(dto.password);

    const randomUUID: string = generateId();

    const newUser: UserDocument = this.UserModel.createInstance(dto, hash, {
      confirmationCode: randomUUID,
      expirationDate: add(new Date(), {
        hours: 1,
        minutes: 30,
      }),
      isConfirmed: false,
    });

    const isUser: UserDocument | null =
      await this.usersExternalRepository.getUserByLoginOrEmail(
        dto.login,
        dto.email,
      );

    if (isUser) {
      if (isUser.login === dto.login) {
        throw new BadRequestException([
          {
            message: 'Login already exists',
            field: 'login',
          },
        ]);
      } else if (isUser.email === dto.email) {
        throw new BadRequestException([
          {
            message: 'email already exists',
            field: 'email',
          },
        ]);
      }
    }

    await this.usersExternalRepository.createUser(newUser);

    try {
      await this.emailAdapter.sendEmail(
        dto.email,
        randomUUID,
        emailExamples.registrationEmail,
      );
    } catch (e) {
      console.log(e);
    }

    return newUser;
  }

  async confirmEmail(code: string) {
    const user: UserDocument | null =
      await this.usersExternalRepository.findUserByCode(code);

    if (!user) {
      throw new BadRequestException([
        {
          message: 'Invalid confirmation code',
          field: 'code',
        },
      ]);
    }

    if (user.emailConfirmation.isConfirmed) {
      throw new BadRequestException([
        {
          message: 'Email already confirmed',
          field: 'code',
        },
      ]);
    }

    if (user.emailConfirmation.expirationDate < new Date()) {
      throw new BadRequestException([
        {
          message: 'Confirmation code expired',
          field: 'code',
        },
      ]);
    }

    user.confirmEmail();

    await this.usersExternalRepository.save(user);
  }

  async resendEmail(email: string) {
    const newExpiration: Date = add(new Date(), { hours: 1, minutes: 30 });
    const newCode = generateId();

    const user: UserDocument =
      await this.usersExternalRepository.findUserByEmail(email);

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

  async login(dto: LoginDto): Promise<AccessAndRefreshTokensType> {
    const user: UserDocument =
      await this.usersExternalRepository.findByLoginOrEmail(dto.loginOrEmail);

    const deviceId: string = randomUUID();

    const isValidatePassword: boolean = await this.hashAdapter.compare(
      user.password,
      dto.password,
    );

    if (!isValidatePassword) {
      throw new UnauthorizedException([
        {
          message: 'Invalid login or password',
          field: 'user',
        },
      ]);
    }

    const accessToken: string = await this.jwtAdapter.createAccessToken(
      user._id.toString(),
    );
    const refreshToken: string = await this.jwtAdapter.createRefreshToken(
      user._id.toString(),
      deviceId,
    );

    return {
      accessToken,
      refreshToken,
    };
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

    const existUser: UserDocument =
      await this.usersExternalRepository.getUserById(
        passwordRecovery.userId.toString(),
      );

    existUser.setPassword(hash);

    await this.usersExternalRepository.save(existUser);

    passwordRecovery.markAsUsed();

    await this.passwordRecoveryExternalRepository.markAsUsedById(
      passwordRecovery,
    );
  }
}
