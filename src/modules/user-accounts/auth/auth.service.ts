import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor() {}
  // async refreshToken(payload: JwtPayload): Promise<AccessAndRefreshTokensType> {
  //   const accessToken: string = await this.jwtAdapter.createAccessToken(
  //     payload.userId,
  //   );
  //   const refreshToken: string = await this.jwtAdapter.createRefreshToken(
  //     payload.userId,
  //     payload.deviceId!,
  //   );
  //
  //   return {
  //     accessToken,
  //     refreshToken,
  //   };
  // }

  async logout() {}
}
