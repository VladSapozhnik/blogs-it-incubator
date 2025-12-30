import { Injectable, NotFoundException } from '@nestjs/common';
import { PostDocument } from './entities/post.entity';
import { GetPostsQueryParamsDto } from './dto/post-query-input.dto';
import { PostsQueryRepository } from './posts.query.repository';
import { LikesQueryExternalService } from '../likes/likes.query.external.service';
import { ExtendedLikesInfoType } from '../likes/mappers/like-info-for-post.mapper';
import { PostsMapper } from './mappers/blogs.mapper';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view.dto';

@Injectable()
export class PostsQueryService {
  constructor(
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly likesQueryExternalService: LikesQueryExternalService,
  ) {}

  async getPosts(
    queryDto: GetPostsQueryParamsDto,
    userId: string | null,
    blogId?: string,
  ): Promise<PaginatedViewDto<PostsMapper[]>> {
    const { posts, totalCount } = await this.postsQueryRepository.getPosts(
      queryDto,
      blogId,
    );

    const items: PostsMapper[] = await Promise.all(
      posts.map(async (post) => {
        const extendedLikesInfoType: ExtendedLikesInfoType =
          await this.likesQueryExternalService.likesInfoForPosts(
            post._id.toString(),
            userId,
          );

        return PostsMapper.mapToView(post, extendedLikesInfoType);
      }),
    );

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: queryDto.pageNumber,
      size: queryDto.pageSize,
    });
  }

  async getPostById(id: string, userId: string | null): Promise<PostsMapper> {
    const likesInfo: ExtendedLikesInfoType =
      await this.likesQueryExternalService.likesInfoForPosts(id, userId);

    const post: PostDocument | null =
      await this.postsQueryRepository.getPostById(id);

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return PostsMapper.mapToView(post, likesInfo);
  }
}
