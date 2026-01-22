import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { configValidationUtility } from '../setup/config-validation.utility';

export enum Environments {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TESTING = 'testing',
}

@Injectable()
export class CoreConfig {
  @IsNumber({}, { message: 'Set Env variable PORT' })
  port: number;

  @IsNotEmpty({ message: 'Set Env variable MONGO_URI' })
  mongoURI: string;

  @IsEnum(Environments, {
    message:
      'Ser correct NODE_ENV value, available values: ' +
      configValidationUtility.getEnumValues(Environments).join(', '),
  })
  env: string;

  @IsNotEmpty({ message: 'Set Env variable JWT_SECRET_KEY' })
  jwt_secret: string;
  //     #ключ для подписи токена
  @IsNotEmpty({ message: 'Set Env variable JWT_REFRESH_SECRET_KEY' })
  jwtRefreshSecret: string;
  // # жизнь токена
  @IsNotEmpty({ message: 'Set Env variable ACCESS_TOKEN_EXPIRE_IN' })
  @IsString()
  accessTokenExpires: string;
  // # жизнь refresh токена
  @IsNotEmpty({ message: 'Set Env variable REFRESH_TOKEN_EXPIRE_IN' })
  @IsString()
  refreshTokenExpires: string;
  // # опасные настройки, если true, то все зарегистрированные пользователи будут автоматически подтверждены; для production FALSE
  @IsBoolean({
    message:
      'Set Env variable IS_USER_AUTOMATICALLY_CONFIRMED, available values: true, false, 0, 1',
  })
  isUserConfirm: boolean;
  // # почта пользователя который отправляет письма
  @IsNotEmpty({ message: 'Set env variable USER_GMAIL' })
  userGmail: string;
  // # пароль пользователя который отправляет письма
  @IsNotEmpty({ message: 'Set env variable USER_GMAIL_PASSWORD' })
  userGmailPassword: string;
  // # включить ограничение запросов
  @IsBoolean({
    message:
      'Set Env variable THROTTLE_ON, available values: true, false, 0, 1',
  })
  isThrottleEnabled: boolean;
  // # время для лимита запросов
  @IsNotEmpty({ message: 'Set env variable THROTTLE_TTL' })
  @IsNumber({}, { message: 'Set env variable THROTTLE_TTL as number' })
  throttleTtl: number;
  // # количество лимит запросов
  @IsNotEmpty({ message: 'Set env variable THROTTLE_LIMIT' })
  @IsNumber({}, { message: 'Set env variable THROTTLE_LIMIT as number' })
  throttleLimit: number;

  constructor(private configService: ConfigService) {
    this.port = Number(this.configService.get('PORT')) || 3005;

    this.mongoURI = this.configService.get('MONGODB_URI') as string;

    this.env = this.configService.get('NODE_ENV') as string;

    this.jwt_secret = this.configService.get('JWT_SECRET_KEY') as string;

    this.jwtRefreshSecret = this.configService.get(
      'JWT_REFRESH_SECRET_KEY',
    ) as string;

    this.accessTokenExpires = this.configService.get<string>(
      'ACCESS_TOKEN_EXPIRE_IN',
    ) as string;

    this.refreshTokenExpires = this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRE_IN',
    ) as string;

    this.isUserConfirm = configValidationUtility.convertToBoolean(
      this.configService.get('IS_USER_AUTOMATICALLY_CONFIRMED') as string,
    ) as boolean;

    this.userGmail = this.configService.get('USER_GMAIL') as string;

    this.userGmailPassword = this.configService.get(
      'USER_GMAIL_PASSWORD',
    ) as string;

    this.isThrottleEnabled = configValidationUtility.convertToBoolean(
      this.configService.get('THROTTLE_ON') as string,
    ) as boolean;

    this.throttleTtl = Number(this.configService.get('THROTTLE_TTL') as string);

    this.throttleLimit = Number(
      this.configService.get('THROTTLE_LIMIT') as string,
    );

    configValidationUtility.validateConfig(this);
  }
}
