import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users/entities/user.entity';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/services/users.service';
import { UsersRepository } from './users/repositories/users.repository';
import { UsersQueryRepository } from './users/repositories/users.query.repository';
import {
  RateLimit,
  RateLimitSchema,
} from './rate-limit/entities/rate-limit.entity';
import {
  PasswordRecovery,
  PasswordRecoverySchema,
} from './password-recovery/entities/password-recovery.entity';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PasswordRecoveryExternalRepository } from './password-recovery/password-recovery.external.repository';
import { EmailAdapter } from '../../core/adapters/email.adapter';
import { HashAdapter } from '../../core/adapters/hash.adapter';
import { JwtAdapter } from '../../core/adapters/jwt.adapter';
import { CookieAdapter } from '../../core/adapters/cookie.adapter';
import { UsersExternalRepository } from './users/repositories/users.external.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { JwtRefreshStrategy } from './auth/strategies/jwt-refresh.strategy';

@Module({
  imports: [
    PassportModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RateLimit.name, schema: RateLimitSchema },
      { name: PasswordRecovery.name, schema: PasswordRecoverySchema },
    ]),
  ],
  controllers: [UsersController, AuthController],
  providers: [
    JwtService,
    UsersService,
    UsersRepository,
    UsersExternalRepository,
    UsersQueryRepository,
    AuthService,
    PasswordRecoveryExternalRepository,
    EmailAdapter,
    HashAdapter,
    JwtAdapter,
    CookieAdapter,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
})
export class UserAccountsModule {}
