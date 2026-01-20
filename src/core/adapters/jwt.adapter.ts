import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtRefreshPayload } from '../types/jwt-payload.type';

@Injectable()
export class JwtAdapter {
  private readonly jwt_secret_key: string;
  private readonly jwt_refresh_secret_key: string;

  constructor(private readonly jwtService: JwtService) {
    this.jwt_secret_key = process.env.JWT_SECRET_KEY || 'jwtSecret';
    this.jwt_refresh_secret_key =
      process.env.JWT_REFERSH_SECRET_KEY || 'refreshSecret';
  }

  async createAccessToken(userId: string): Promise<string> {
    return this.jwtService.signAsync(
      { userId: userId.toString() },
      { secret: this.jwt_secret_key, expiresIn: '10s' },
    );
  }
  async createRefreshToken(userId: string, deviceId: string): Promise<string> {
    return this.jwtService.signAsync(
      { userId: userId.toString(), deviceId: deviceId },
      { secret: this.jwt_refresh_secret_key, expiresIn: '20s' },
    );
  }
  // verifyAccessToken(jwtToken: string): string | null {
  //   try {
  //     const result: any = verify(jwtToken, this.jwt_secret_key);
  //     return result.userId.toString();
  //   } catch {
  //     return null;
  //   }
  // }
  async verifyRefreshToken(token: string): Promise<JwtRefreshPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: this.jwt_refresh_secret_key,
    });
  }
}
