import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../../../../core/types/jwt-payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY || 'jwtSecret',
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    if (!payload.userId) {
      throw new UnauthorizedException([
        {
          message: 'Unauthorized',
          field: 'user',
        },
      ]);
    }

    return payload;
  }
}
