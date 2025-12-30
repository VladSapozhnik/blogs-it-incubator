import { Injectable } from '@nestjs/common';
import { GetPostsQueryParamsDto } from './dto/post-query-input.dto';
import { LikesQueryExternalService } from '../likes/likes.query.external.service';
import { ExtendedLikesInfoType } from '../likes/mappers/like-info-for-post.mapper';
import { PostsMapper } from './mappers/blogs.mapper';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view.dto';
import { PostsQueryExternalRepository } from './posts.query.external.repository';
import { PostDocument } from './entities/post.entity';

@Injectable()
export class PostsQueryExternalService {
  constructor(
    private readonly postsQueryExternalRepository: PostsQueryExternalRepository,
    private readonly likesQueryExternalService: LikesQueryExternalService,
  ) {}

  async getPosts(
    queryDto: GetPostsQueryParamsDto,
    userId: string | null,
    blogId: string,
  ): Promise<PaginatedViewDto<PostsMapper[]>> {
    const { posts, totalCount } =
      await this.postsQueryExternalRepository.getPosts(queryDto, blogId);

    const items: PostsMapper[] = await Promise.all(
      posts.map(async (post: PostDocument): Promise<PostsMapper> => {
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

  // async getPostById(id: string, userId: string | null): Promise<PostsMapper> {
  //   const likesInfo: ExtendedLikesInfoType =
  //     await this.likesQueryExternalService.likesInfoForPosts(id, userId);
  //
  //   const post: PostDocument | null =
  //     await this.postsQueryRepository.getPostById(id);
  //
  //   if (!post) {
  //     throw new NotFoundException(`Post with id ${id} not found`);
  //   }
  //
  //   return PostsMapper.mapToView(post, likesInfo);
  // }
}
