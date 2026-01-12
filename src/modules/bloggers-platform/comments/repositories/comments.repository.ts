import { Injectable } from '@nestjs/common';
import {
  Comment,
  CommentDocument,
  type CommentModelType,
} from '../entities/comment.entity';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Types } from 'mongoose';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name)
    private readonly CommentModel: CommentModelType,
  ) {}
  async getCommentById(id: string): Promise<CommentDocument | null> {
    const comment: CommentDocument | null = await this.CommentModel.findOne({
      _id: new Types.ObjectId(id),
    });

    if (!comment) {
      return null;
    }

    return comment;
  }
  async updateComment(comment: CommentDocument): Promise<string> {
    const result: CommentDocument = await comment.save();

    return result._id.toString();
  }
  async removeComment(comment: CommentDocument): Promise<boolean> {
    const result: DeleteResult = await comment.deleteOne();

    return result.deletedCount === 1;
  }
}
