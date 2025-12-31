import { PostDocument } from '../entities/post.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsExternalRepository {
  async createPost(post: PostDocument): Promise<string> {
    const result: PostDocument = await post.save();

    return result._id.toString();
  }
}
