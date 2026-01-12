import {
  Comment,
  CommentDocument,
  type CommentModelType,
} from '../entities/comment.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { GetCommentQueryParamsDto } from '../dto/comment-query-input.dto';

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
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }
}
