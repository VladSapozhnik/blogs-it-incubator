import { LoginDto } from '../../dto/login.dto';
import { UserDocument } from '../../../users/entities/user.entity';
import { randomUUID } from 'node:crypto';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { HttpStatus } from '@nestjs/common';
import { UsersExternalRepository } from '../../../users/repositories/users.external.repository';
import { JwtAdapter } from '../../../../../core/adapters/jwt.adapter';
import { HashAdapter } from '../../../../../core/adapters/hash.adapter';
import { AccessAndRefreshTokensType } from '../../types/access-and-refresh-tokens.type';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class LoginCommand {
  constructor(public readonly dto: LoginDto) {}
}

@CommandHandler(LoginCommand)
export class LoginUseCase implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly usersExternalRepository: UsersExternalRepository,
    private readonly hashAdapter: HashAdapter,
    private readonly jwtAdapter: JwtAdapter,
  ) {}

  async execute({ dto }: LoginCommand): Promise<AccessAndRefreshTokensType> {
    const user: UserDocument =
      await this.usersExternalRepository.findByLoginOrEmail(dto.loginOrEmail);

    const deviceId: string = randomUUID();

    const isValidatePassword: boolean = await this.hashAdapter.compare(
      user.password,
      dto.password,
    );

    if (!isValidatePassword) {
      throw new DomainException({
        status: HttpStatus.UNAUTHORIZED,
        errorsMessages: [
          {
            message: 'Invalid login or password',
            field: 'user',
          },
        ],
      });
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
}
