import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
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

  @IsEnum(Environments)
  env: string;

  constructor(private configService: ConfigService) {
    this.port = Number(this.configService.get('PORT'));
    this.mongoURI = this.configService.get('MONGODB_URI') as string;
    this.env = this.configService.get('NODE_ENV') as string;

    configValidationUtility.validateConfig(this);
  }
}
