import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http'; // Импортируем как Strategy
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class SuperAdminStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }

  validate(username: string, password: string): any {
    if (username === 'admin' && password === 'qwerty') {
      return true;
    }
    throw new UnauthorizedException([
      {
        message: 'Invalid username or password',
        field: 'admin',
      },
    ]);
  }
}
