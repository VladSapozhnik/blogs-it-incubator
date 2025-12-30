import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, type PostModelType } from './entities/post.entity';
import { GetPostsQueryParamsDto } from './dto/post-query-input.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name) private readonly PostModel: PostModelType,
  ) {}

  async getPosts(queryDto: GetPostsQueryParamsDto) {
    const posts: PostDocument[] = await this.PostModel.find()
      .sort({ [queryDto.sortBy]: queryDto.sortDirection })
      .limit(queryDto.pageSize)
      .skip(queryDto.calculateSkip());

    const totalCount: number = await this.PostModel.countDocuments();

    return {
      posts,
      totalCount,
    };
  }

  async getPostById(id: string): Promise<PostDocument> {
    const existPost = await this.PostModel.findOne({
      _id: new Types.ObjectId(id),
    });

    if (!existPost) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return existPost;
  }
}
