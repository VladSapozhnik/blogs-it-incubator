import {
  Comment,
  CommentDocument,
  type CommentModelType,
} from '../entities/comment.entity';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { GetCommentQueryParamsDto } from '../dto/comment-query-input.dto';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';

@Injectable()
export class CommentsQueryExternalRepository {
  constructor(
    @InjectModel(Comment.name) private readonly CommentModel: CommentModelType,
  ) {}

  async getCommentsByPostId(
    queryDto: GetCommentQueryParamsDto,
    postId: string,
  ) {
    const comments: CommentDocument[] = await this.CommentModel.find({
      postId: new Types.ObjectId(postId),
    })
      .sort({ [queryDto.sortBy]: queryDto.sortDirection })
      .skip(queryDto.calculateSkip())
      .limit(queryDto.pageSize);

    const totalCount: number = await this.CommentModel.countDocuments({
      postId: new Types.ObjectId(postId),
    });

    return {
      comments,
      totalCount,
    };
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
