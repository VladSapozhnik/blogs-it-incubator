import { JwtAdapter } from '../../../../../core/adapters/jwt.adapter';
import { AccessAndRefreshTokensType } from '../../types/access-and-refresh-tokens.type';
import { JwtPayload } from '../../../../../core/types/jwt-payload.type';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class RefreshTokenCommand {
  constructor(public readonly payload: JwtPayload) {}
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenUseCase implements ICommandHandler<
  RefreshTokenCommand,
  AccessAndRefreshTokensType
> {
  constructor(private readonly jwtAdapter: JwtAdapter) {}

  async execute({
    payload,
  }: RefreshTokenCommand): Promise<AccessAndRefreshTokensType> {
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
}
