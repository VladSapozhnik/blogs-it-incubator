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
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 10000,
          limit: 5,
        },
      ],
    }),
    CqrsModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: (config: CoreConfig) => {
        return {
          uri: config.mongoURI,
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
