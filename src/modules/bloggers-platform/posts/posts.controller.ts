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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsMapper } from './mappers/blogs.mapper';
import { PostsQueryService } from './posts.query.service';
import { GetPostsQueryParamsDto } from './dto/post-query-input.dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postQueryService: PostsQueryService,
  ) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto): Promise<PostsMapper> {
    const id: string = await this.postsService.createPost(createPostDto);

    return this.postQueryService.getPostById(id, null);
  }

  @Get()
  findAll(
    @Query() query: GetPostsQueryParamsDto,
  ): Promise<PaginatedViewDto<PostsMapper[]>> {
    return this.postQueryService.getPosts(query, null);
  }

  @Get(':id')
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
