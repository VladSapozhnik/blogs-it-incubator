import { configModule } from './dynamic-config-module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ThrottlerModule } from '@nestjs/throttler';
import { CoreModule } from './core/core.module';
import { CoreConfig } from './core/core.config';
import { TestingModule } from './modules/testing/testing.module';

@Module({
  imports: [
    configModule,
    ThrottlerModule.forRootAsync({
      useFactory: (coreConfig: CoreConfig) => {
        return {
          disabled: !coreConfig.isThrottleEnabled,
          throttlers: [
            {
              ttl: coreConfig.throttleTtl,
              limit: coreConfig.throttleLimit,
            },
          ],
        };
      },
      inject: [CoreConfig],
    }),
    CqrsModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: (coreConfig: CoreConfig) => {
        return {
          uri: coreConfig.mongoURI,
        };
      },
      inject: [CoreConfig],
    }),
    BloggersPlatformModule,
    UserAccountsModule,
    CoreModule,
    TestingModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
