import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './services/posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsMapper } from './mappers/blogs.mapper';
import { PostsQueryService } from './services/posts.query.service';
import { GetPostsQueryParamsDto } from './dto/post-query-input.dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view.dto';
import { GetCommentQueryParamsDto } from '../comments/dto/comment-query-input.dto';
import { CommentsQueryExternalService } from '../comments/services/comments.query.external.service';
import { CommentsMapper } from '../comments/mappers/comments.mapper';
import { SuperAdminAuthGuard } from '../../user-accounts/users/guards/super-admin-auth.guard';
import { Public } from '../../../core/decorators/public.decorator';
import { CommentsExternalService } from '../comments/services/comments.external.service';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';
import { User } from '../../user-accounts/auth/decorator/user.decorator';
import { JwtAuthGuard } from '../../user-accounts/auth/guards/jwt-auth.guard';
import { LikesExternalService } from '../likes/services/likes.external.service';
import { UpdateLikeDto } from '../likes/dto/update-like.dto';

@Controller('posts')
// @UseGuards(SuperAdminAuthGuard)
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postQueryService: PostsQueryService,
    private readonly commentsQueryExternalService: CommentsQueryExternalService,
    private readonly commentsExternalService: CommentsExternalService,
    private readonly likesExternalService: LikesExternalService,
  ) {}

  @Put(':postId/like-status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async makeStatus(
    @Param('postId') postId: string,
    @User('userId') userId: string,
    @Body() dto: UpdateLikeDto,
  ) {
    return this.likesExternalService.updatePostLikeStatus(userId, postId, dto);
  }

  @Post()
  async create(@Body() createPostDto: CreatePostDto): Promise<PostsMapper> {
    const id: string = await this.postsService.createPost(createPostDto);

    return this.postQueryService.getPostById(id, null);
  }

  @Get()
  @Public()
  findAll(
    @Query() query: GetPostsQueryParamsDto,
  ): Promise<PaginatedViewDto<PostsMapper[]>> {
    return this.postQueryService.getPosts(query, null);
  }

  @Get(':postsId/comments')
  @Public()
  findCommentsForPost(
    @Param('postsId') postsId: string,
    @Query() query: GetCommentQueryParamsDto,
  ): Promise<PaginatedViewDto<CommentsMapper[]>> {
    return this.commentsQueryExternalService.getCommentsByPostId(
      query,
      postsId,
      null,
    );
  }

  @Post(':postsId/comments')
  @UseGuards(JwtAuthGuard)
  async createCommentForPost(
    @Param('postsId') postsId: string,
    @User('userId') userId: string,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentsMapper> {
    const commentId: string = await this.commentsExternalService.createComment(
      userId,
      postsId,
      createCommentDto,
    );

    return this.commentsQueryExternalService.getCommentById(commentId, userId);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.postQueryService.getPostById(id, null);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.updatePost(id, updatePostDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.postsService.removePost(id);
  }
}
