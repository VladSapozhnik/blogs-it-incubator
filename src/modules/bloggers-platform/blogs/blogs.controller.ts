import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Put,
  Param,
  HttpCode,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogsQueryRepository } from './blogs.query.repository';
import { GetBlogsQueryParamsDto } from './dto/blog-query-input.dto';
import { BlogsMapper } from './mappers/blogs.mapper';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view.dto';
import { GetPostsQueryParamsDto } from '../posts/dto/post-query-input.dto';
import { PostsQueryExternalService } from '../posts/posts.query.external.service';
import { PostsMapper } from '../posts/mappers/blogs.mapper';
import { PostsExternalService } from '../posts/posts.external.service';
import { CreatePostForBlogDto } from '../posts/dto/create-post-for-blog.dto';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsExternalService: PostsExternalService,
    private readonly postsQueryExternalService: PostsQueryExternalService,
  ) {}
  @Post()
  async create(@Body() createBlogDto: CreateBlogDto): Promise<BlogsMapper> {
    const id: string = await this.blogsService.createBlog(createBlogDto);

    return this.blogsQueryRepository.getBlogById(id);
  }

  @Get()
  findAll(
    @Query() query: GetBlogsQueryParamsDto,
  ): Promise<PaginatedViewDto<BlogsMapper[]>> {
    return this.blogsQueryRepository.getBlogs(query);
  }

  @Get(':blogId/posts')
  findAllPostByBlogId(
    @Param('blogId') blogId: string,
    @Query() query: GetPostsQueryParamsDto,
  ): Promise<PaginatedViewDto<PostsMapper[]>> {
    return this.postsQueryExternalService.getPosts(query, null, blogId);
  }

  @Post(':blogId/posts')
  async createPostForBlog(
    @Param('blogId') blogId: string,
    @Body() createBlogDto: CreatePostForBlogDto,
  ): Promise<BlogsMapper> {
    const id: string = await this.postsExternalService.createPostForBlog(
      createBlogDto,
      blogId,
    );

    return this.blogsQueryRepository.getBlogById(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<BlogsMapper> {
    return this.blogsQueryRepository.getBlogById(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogsService.updateBlog(id, updateBlogDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.blogsService.removeBlogById(id);
  }
}
