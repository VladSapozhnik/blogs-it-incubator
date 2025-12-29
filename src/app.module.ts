import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BlogsModule } from './modules/blogs/blogs.module';
import { PostsModule } from './modules/posts/posts.module';
import { UsersModule } from './modules/users/users.module';
import { CommentsModule } from './modules/comments/comments.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://vladbars2:vlad34299@cluster0.jgd7edn.mongodb.net/',
      { dbName: 'blog-nest-it-incubator' },
    ),
    BlogsModule,
    PostsModule,
    UsersModule,
    CommentsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
