import {
  Comment,
  CommentDocument,
  type CommentModelType,
} from '../entities/comment.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CommentsExternalRepository {
  constructor(
    @InjectModel(Comment.name) private readonly CommentModel: CommentModelType,
  ) {}

  async save(comment: CommentDocument): Promise<string> {
    const result: CommentDocument = await comment.save();

    return result._id.toString();
  }

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
            field: 'comment',
          },
        ],
      });
    }

    return comment;
  }
}
