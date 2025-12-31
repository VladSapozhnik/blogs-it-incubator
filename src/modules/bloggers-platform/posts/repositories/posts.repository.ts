import {
  Post,
  PostDocument,
  type PostModelType,
} from '../entities/post.entity';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name) private readonly PostModel: PostModelType,
  ) {}

  async createPost(post: PostDocument): Promise<string> {
    const result: PostDocument = await post.save();
    return result._id.toString();
  }

  async findPostById(postId: string): Promise<PostDocument> {
    const existPost: PostDocument | null = await this.PostModel.findOne({
      _id: postId,
    });

    if (!existPost) {
      throw new NotFoundException('Failed to update Post');
    }

    return existPost;
  }

  async updatePost(post: PostDocument): Promise<string> {
    const result: PostDocument = await post.save();

    return result._id.toString();
  }

  async removePost(post: PostDocument): Promise<boolean> {
    const result: DeleteResult = await post.deleteOne();

    return result.deletedCount === 1;
  }
}
