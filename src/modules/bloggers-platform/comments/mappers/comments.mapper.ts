import { CommentDocument } from '../entities/comment.entity';
import { LikesInfoOutputType } from '../../likes/types/likes-info-output.type';

export class CommentsMapper {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
  likesInfo: LikesInfoOutputType;

  static mapToView(
    this: void,
    comment: CommentDocument,
    likesInfo: LikesInfoOutputType,
  ): CommentsMapper {
    const dto = new CommentsMapper();

    dto.id = comment._id.toString();
    dto.content = comment.content;
    dto.commentatorInfo = {
      userId: comment.commentatorInfo.userId.toString(),
      userLogin: comment.commentatorInfo.userLogin,
    };
    dto.createdAt = comment.createdAt.toISOString();
    dto.likesInfo = likesInfo;

    return dto;
  }
}
