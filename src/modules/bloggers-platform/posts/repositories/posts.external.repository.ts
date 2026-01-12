import {
  Post,
  PostDocument,
  type PostModelType,
} from '../entities/post.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';

@Injectable()
export class PostsExternalRepository {
  constructor(
    @InjectModel(Post.name) private readonly PostModel: PostModelType,
  ) {}

  async createPost(post: PostDocument): Promise<string> {
    const result: PostDocument = await post.save();

    return result._id.toString();
  }

  async findPostById(postId: string): Promise<PostDocument> {
    const existPost = await this.PostModel.findOne({
      _id: new Types.ObjectId(postId),
    });

    if (!existPost) {
      throw new DomainException({
        status: HttpStatus.UNAUTHORIZED,
        errorsMessages: [
          {
            message: 'Not found post',
            field: 'post',
          },
        ],
      });
    }

    return existPost;
  }
}
