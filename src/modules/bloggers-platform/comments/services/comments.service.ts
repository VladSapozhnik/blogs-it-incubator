import { HttpStatus, Injectable } from '@nestjs/common';
import { CommentDocument } from '../entities/comment.entity';
import { CommentsRepository } from '../repositories/comments.repository';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async updateComment(userId: string, id: string, body: UpdateCommentDto) {
    const findComment: CommentDocument | null =
      await this.commentsRepository.getCommentById(id);

    if (!findComment) {
      throw new DomainException({
        status: HttpStatus.NOT_FOUND,
        errorsMessages: [
          {
            message: 'Comment not found',
            field: 'comment',
          },
        ],
      });
    }

    if (findComment.commentatorInfo.userId.toString() !== userId) {
      throw new DomainException({
        status: HttpStatus.FORBIDDEN,
        errorsMessages: [
          {
            message: 'You can update only your own comments',
            field: 'comment',
          },
        ],
      });
    }

    findComment.content = body.content;

    await this.commentsRepository.updateComment(findComment);
  }

  async removeComment(userId: string, id: string) {
    const findComment: CommentDocument | null =
      await this.commentsRepository.getCommentById(id);

    if (!findComment) {
      throw new DomainException({
        status: HttpStatus.NOT_FOUND,
        errorsMessages: [
          {
            message: 'Comment not found',
            field: 'comment',
          },
        ],
      });
    }

    if (findComment.commentatorInfo.userId.toString() !== userId) {
      throw new DomainException({
        status: HttpStatus.FORBIDDEN,
        errorsMessages: [
          {
            message: 'You can delete only your own comments',
            field: 'comment',
          },
        ],
      });
    }

    await this.commentsRepository.removeComment(findComment);
  }
}
