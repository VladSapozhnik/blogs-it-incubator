import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, type PostModelType } from './entities/post.entity';
import { GetPostsQueryParamsDto } from './dto/post-query-input.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name) private readonly PostModel: PostModelType,
  ) {}

  async getPosts(queryDto: GetPostsQueryParamsDto, blogId?: string) {
    const filter: { blogId?: string } = {};

    if (blogId) {
      filter.blogId = blogId;
    }

    const posts: PostDocument[] = await this.PostModel.find(filter)
      .sort({ [queryDto.sortBy]: queryDto.sortDirection })
      .limit(queryDto.pageSize)
      .skip(queryDto.calculateSkip());

    const totalCount: number = await this.PostModel.countDocuments(filter);

    return {
      posts,
      totalCount,
    };
  }

  async getPostById(id: string): Promise<PostDocument | null> {
    return this.PostModel.findOne({
      _id: id,
    });
  }
}
