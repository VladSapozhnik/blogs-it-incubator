import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blogs/entities/blog.entity';
import { BlogsController } from './blogs/blogs.controller';
import { PostsController } from './posts/posts.controller';
import { Post, PostSchema } from './posts/entities/post.entity';
import { Like, LikeSchema } from './likes/entities/like.entity';
import { BlogsService } from './blogs/services/blogs.service';
import { BlogsRepository } from './blogs/repositories/blogs.repository';
import { BlogsQueryRepository } from './blogs/repositories/blogs.query.repository';
import { BlogsExternalRepository } from './blogs/repositories/blogs.external.repository';
import { PostsService } from './posts/services/posts.service';
import { PostsQueryService } from './posts/services/posts.query.service';
import { PostsExternalService } from './posts/services/posts.external.service';
import { PostsRepository } from './posts/repositories/posts.repository';
import { PostsQueryRepository } from './posts/repositories/posts.query.repository';
import { LikesExternalService } from './likes/services/likes.external.service';
import { LikesQueryExternalService } from './likes/services/likes.query.external.service';
import { LikesQueryExternalRepository } from './likes/repositories/likes.query.external.repository';
import { LikesController } from './likes/likes.controller';
import { PostsQueryExternalRepository } from './posts/repositories/posts.query.external.repository';
import { PostsQueryExternalService } from './posts/services/posts.query.external.service';
import { PostsExternalRepository } from './posts/repositories/posts.external.repository';
import { CommentsController } from './comments/comments.controller';
import { CommentsQueryService } from './comments/services/comments.query.service';
import { CommentsQueryRepository } from './comments/repositories/comments.query.repository';
import { Comment, CommentSchema } from './comments/entities/comment.entity';
import { CommentsQueryExternalRepository } from './comments/repositories/comments.query.external.repository';
import { CommentsQueryExternalService } from './comments/services/comments.query.external.service';
import { CommentsExternalRepository } from './comments/repositories/comments.external.repository';
import { CommentsRepository } from './comments/repositories/comments.repository';
import { CommentsService } from './comments/services/comments.service';
import { CommentsExternalService } from './comments/services/comments.external.service';
import { UsersExternalRepository } from '../user-accounts/users/repositories/users.external.repository';
import { UserAccountsModule } from '../user-accounts/user-accounts.module';

@Module({
  imports: [
    UserAccountsModule,
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Like.name, schema: LikeSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [
    BlogsController,
    PostsController,
    LikesController,
    CommentsController,
  ],
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
    LikesExternalService,
    LikesQueryExternalService,
    LikesQueryExternalRepository,
    CommentsService,
    CommentsExternalService,
    CommentsQueryService,
    CommentsExternalRepository,
    CommentsRepository,
    CommentsQueryExternalService,
    CommentsQueryRepository,
    CommentsQueryExternalRepository,
  ],
})
export class BloggersPlatformModule {}
