import {
  Comment,
  CommentDocument,
  type CommentModelType,
} from './entities/comment.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { GetCommentQueryParamsDto } from './dto/comment-query-input.dto';

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
}
