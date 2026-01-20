import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users/entities/user.entity';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/application/users.service';
import { UsersRepository } from './users/repositories/users.repository';
import { UsersQueryRepository } from './users/repositories/users.query.repository';
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
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { SuperAdminStrategy } from './users/strategies/super-admin.strategy';
import { UsersQueryExternalRepository } from './users/repositories/users.query.external.repository';
import { RegistrationUseCase } from './auth/application/usecases/registration.usecase';
import { LoginUseCase } from './auth/application/usecases/login.usecase';
import { ConfirmEmailUseCase } from './auth/application/usecases/confirm-email.usecase';
import { NewPasswordUseCase } from './auth/application/usecases/new-password.usecase';
import { PasswordRecoveryUseCase } from './auth/application/usecases/password-recovery.usecase';
import { ResendEmailUseCase } from './auth/application/usecases/resend-email.usecase';
import { RefreshTokenUseCase } from './auth/application/usecases/refresh-token.usecase';
import { JwtRefreshStrategy } from './auth/strategies/jwt-refresh.strategy';
import {
  SecurityDevice,
  SecurityDeviceSchema,
} from './security-devices/entities/security-device.entity';
import { RemoveDeviceSessionUseCase } from './security-devices/application/usecase/remove-device-session.usecase';
import { RemoveOtherDeviceSessionUseCase } from './security-devices/application/usecase/remove-other-device-session.usecase';
import { GetDeviceSessionByUserIdQueryHandler } from './security-devices/application/queries/get-device-session-by-user-id.query';
import { SecurityDevicesRepository } from './security-devices/repositories/security-devices.repository';
import { SecurityDevicesQueryRepository } from './security-devices/repositories/security-devices.query.repository';
import { SecurityDevicesService } from './security-devices/application/security-devices.service';
import { SecurityDevicesController } from './security-devices/security-devices.controller';
import { LogoutUseCase } from './auth/application/usecases/logout.usecase';
import { CreateUserUseCase } from './users/application/usecases/create-user.usecase';
import { RemoveUserUseCase } from './users/application/usecases/remove-user.usecase';
import { GetUsersQueryHandler } from './users/application/queries/get-users.query';
import { GetUserByIdQueryHandler } from './users/application/queries/get-user-by-id.query';

const useCases = [
  RegistrationUseCase,
  LoginUseCase,
  ConfirmEmailUseCase,
  NewPasswordUseCase,
  PasswordRecoveryUseCase,
  ResendEmailUseCase,
  RefreshTokenUseCase,
  RemoveDeviceSessionUseCase,
  RemoveOtherDeviceSessionUseCase,
  GetDeviceSessionByUserIdQueryHandler,
  LogoutUseCase,
  CreateUserUseCase,
  RemoveUserUseCase,
  GetUsersQueryHandler,
  GetUserByIdQueryHandler,
];

@Module({
  imports: [
    PassportModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: PasswordRecovery.name, schema: PasswordRecoverySchema },
      { name: SecurityDevice.name, schema: SecurityDeviceSchema },
    ]),
  ],
  controllers: [UsersController, AuthController, SecurityDevicesController],
  providers: [
    ...useCases,
    JwtService,
    UsersService,
    UsersRepository,
    UsersExternalRepository,
    UsersQueryRepository,
    UsersQueryExternalRepository,
    AuthService,
    PasswordRecoveryExternalRepository,
    EmailAdapter,
    HashAdapter,
    JwtAdapter,
    CookieAdapter,
    JwtStrategy,
    JwtRefreshStrategy,
    SuperAdminStrategy,
    SecurityDevicesRepository,
    SecurityDevicesQueryRepository,
    SecurityDevicesService,
  ],
  exports: [UsersExternalRepository],
})
export class UserAccountsModule {}
