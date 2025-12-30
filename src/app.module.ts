import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://vladbars2:vlad34299@cluster0.jgd7edn.mongodb.net/',
      { dbName: 'blog-nest-it-incubator' },
    ),
    BloggersPlatformModule,
    UserAccountsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
