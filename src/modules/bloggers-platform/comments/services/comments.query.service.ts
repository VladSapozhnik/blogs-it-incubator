import { Injectable } from '@nestjs/common';
import { CommentsQueryRepository } from '../repositories/comments.query.repository';
import { CommentDocument } from '../entities/comment.entity';
import { LikesQueryExternalService } from '../../likes/services/likes.query.external.service';
import { CommentsMapper } from '../mappers/comments.mapper';
import { LikesInfoOutputType } from '../../likes/types/likes-info-output.type';

@Injectable()
export class CommentsQueryService {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly likesQueryExternalServices: LikesQueryExternalService,
  ) {}

  async getCommentById(
    id: string,
    userId: string | null = null,
  ): Promise<CommentsMapper> {
    const comment: CommentDocument | null =
      await this.commentsQueryRepository.getCommentById(id);

    const likesInfo: LikesInfoOutputType =
      await this.likesQueryExternalServices.likesInfoForComment(
        comment._id.toString(),
        userId,
      );

    return CommentsMapper.mapToView(comment, likesInfo);
  }
}
