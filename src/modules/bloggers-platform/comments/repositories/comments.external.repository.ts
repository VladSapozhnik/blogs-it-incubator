import { CommentDocument } from '../entities/comment.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentsExternalRepository {
  async save(comment: CommentDocument): Promise<string> {
    const result: CommentDocument = await comment.save();

    return result._id.toString();
  }
}
