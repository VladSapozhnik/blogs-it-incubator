import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blogs/entities/blog.entity';
import { BlogsController } from './blogs/blogs.controller';
import { PostsController } from './posts/posts.controller';
import { Post, PostSchema } from './posts/entities/post.entity';
import { Like, LikeSchema } from './likes/entities/like.entity';
import { BlogsService } from './blogs/blogs.service';
import { BlogsRepository } from './blogs/blogs.repository';
import { BlogsQueryRepository } from './blogs/blogs.query.repository';
import { BlogsExternalRepository } from './blogs/blogs.external.repository';
import { PostsService } from './posts/posts.service';
import { PostsQueryService } from './posts/posts.query.service';
import { PostsExternalService } from './posts/posts.external.service';
import { PostsRepository } from './posts/posts.repository';
import { PostsQueryRepository } from './posts/posts.query.repository';
import { LikesService } from './likes/likes.service';
import { LikesQueryExternalService } from './likes/likes.query.external.service';
import { LikesQueryExternalRepository } from './likes/likes.query.external.repository';
import { LikesController } from './likes/likes.controller';
import { PostsQueryExternalRepository } from './posts/posts.query.external.repository';
import { PostsQueryExternalService } from './posts/posts.query.external.service';
import { PostsExternalRepository } from './posts/posts.external.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Like.name, schema: LikeSchema },
    ]),
  ],
  controllers: [BlogsController, PostsController, LikesController],
  providers: [
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    BlogsExternalRepository,
    PostsService,
    PostsExternalService,
    PostsQueryService,
    PostsExternalService,
    PostsQueryExternalService,
    PostsRepository,
    PostsExternalRepository,
    PostsQueryRepository,
    PostsQueryExternalRepository,
    LikesService,
    LikesQueryExternalService,
    LikesQueryExternalRepository,
    // LikesRepository,
    // CommentsService,
  ],
})
export class BloggersPlatformModule {}
