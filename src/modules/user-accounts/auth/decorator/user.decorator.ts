import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../../../../core/types/jwt-payload.type';
import { Request } from 'express';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request: Request = ctx.switchToHttp().getRequest();
    return request.user as JwtPayload;
  },
);
