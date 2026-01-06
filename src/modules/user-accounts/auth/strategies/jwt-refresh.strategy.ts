import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../../../../core/types/jwt-payload.type';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Bearer <token>
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET || 'fallback-secret',
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    if (!payload.userId || !payload.deviceId) {
      throw new UnauthorizedException('Invalid refresh token payload');
    }

    return payload;
  }
}
