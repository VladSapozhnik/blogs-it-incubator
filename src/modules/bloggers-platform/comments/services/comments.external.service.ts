import { UserDocument } from 'src/modules/user-accounts/users/entities/user.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDocument,
  type CommentModelType,
} from '../entities/comment.entity';
import { UsersExternalRepository } from '../../../user-accounts/users/repositories/users.external.repository';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { PostDocument } from '../../posts/entities/post.entity';
import { PostsExternalRepository } from '../../posts/repositories/posts.external.repository';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { CommentsExternalRepository } from '../repositories/comments.external.repository';

@Injectable()
export class CommentsExternalService {
  constructor(
    @InjectModel(Comment.name) private readonly CommentModel: CommentModelType,
    private readonly usersExternalRepository: UsersExternalRepository,
    private readonly postsExternalRepository: PostsExternalRepository,
    private readonly commentsExternalRepository: CommentsExternalRepository,
  ) {}

  async createComment(
    userId: string,
    postId: string,
    dto: CreateCommentDto,
  ): Promise<string> {
    const existUser: UserDocument | null =
      await this.usersExternalRepository.getUserById(userId);

    if (!existUser) {
      throw new DomainException({
        status: HttpStatus.UNAUTHORIZED,
        errorsMessages: [
          {
            message: 'Unauthorized',
            field: 'user',
          },
        ],
      });
    }

    const existPost: PostDocument =
      await this.postsExternalRepository.findPostById(postId);

    const newComment: CommentDocument = this.CommentModel.createInstance(
      existPost._id.toString(),
      dto.content,
      existUser._id.toString(),
      existUser.login,
    );

    const commentId: string =
      await this.commentsExternalRepository.save(newComment);

    if (!commentId) {
      throw new DomainException({
        status: HttpStatus.BAD_REQUEST,
        errorsMessages: [
          {
            message: 'Failed to create comment',
            field: 'comment',
          },
        ],
      });
    }

    return commentId;
  }
}
