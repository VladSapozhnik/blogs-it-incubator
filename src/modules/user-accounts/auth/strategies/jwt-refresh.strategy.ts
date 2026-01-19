import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtPayload } from '../../../../core/types/jwt-payload.type';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request): string | null => {
          const data = request?.cookies?.refreshToken as unknown;
          if (typeof data === 'string') {
            return data;
          }
          throw new DomainException({
            status: HttpStatus.UNAUTHORIZED,
            errorsMessages: [
              {
                message: 'Unauthorized',
                field: 'user',
              },
            ],
          });
        },
      ]),
      secretOrKey: process.env.JWT_REFRESH_SECRET || 'refreshSecret',
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload): JwtPayload {
    return payload;
  }
}
