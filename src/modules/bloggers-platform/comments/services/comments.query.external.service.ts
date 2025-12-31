import { Injectable } from '@nestjs/common';
import { CommentDocument } from '../entities/comment.entity';
import { LikesQueryExternalService } from '../../likes/services/likes.query.external.service';
import { CommentsMapper } from '../mappers/comments.mapper';
import { LikesInfoOutputType } from '../../likes/types/likes-info-output.type';
import { CommentsQueryExternalRepository } from '../repositories/comments.query.external.repository';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view.dto';
import { GetCommentQueryParamsDto } from '../dto/comment-query-input.dto';

@Injectable()
export class CommentsQueryExternalService {
  constructor(
    private readonly commentsQueryExternalRepository: CommentsQueryExternalRepository,
    private readonly likesQueryExternalServices: LikesQueryExternalService,
  ) {}

  async getCommentsByPostId(
    queryDto: GetCommentQueryParamsDto,
    postId: string,
    userId: string | null,
  ): Promise<PaginatedViewDto<CommentsMapper[]>> {
    const { comments, totalCount } =
      await this.commentsQueryExternalRepository.getCommentsByPostId(
        queryDto,
        postId,
      );

    const items: CommentsMapper[] = await Promise.all(
      comments.map(
        async (comment: CommentDocument): Promise<CommentsMapper> => {
          const likesInfo: LikesInfoOutputType =
            await this.likesQueryExternalServices.likesInfoForComment(
              comment._id.toString(),
              userId,
            );

          return CommentsMapper.mapToView(comment, likesInfo);
        },
      ),
    );

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: queryDto.pageNumber,
      size: queryDto.pageSize,
    });
  }
}
