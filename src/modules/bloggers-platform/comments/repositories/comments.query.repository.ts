import {
  Comment,
  CommentDocument,
  type CommentModelType,
} from '../entities/comment.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private readonly CommentModel: CommentModelType,
  ) {}

  async getCommentById(id: string): Promise<CommentDocument> {
    const comment: CommentDocument | null = await this.CommentModel.findOne({
      _id: new Types.ObjectId(id),
    });

    if (!comment) {
      throw new DomainException({
        status: HttpStatus.NOT_FOUND,
        errorsMessages: [
          {
            message: 'Comment not found',
            field: 'post',
          },
        ],
      });
    }

    return comment;
  }
}
