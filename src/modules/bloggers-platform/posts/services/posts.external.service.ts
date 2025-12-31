import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Post,
  PostDocument,
  type PostModelType,
} from '../entities/post.entity';
import { BlogDocument } from '../../blogs/entities/blog.entity';
import { PostsExternalRepository } from '../repositories/posts.external.repository';
import { InjectModel } from '@nestjs/mongoose';
import { BlogsExternalRepository } from '../../blogs/repositories/blogs.external.repository';
import { CreatePostForBlogDto } from '../dto/create-post-for-blog.dto';

@Injectable()
export class PostsExternalService {
  constructor(
    @InjectModel(Post.name) private readonly PostModel: PostModelType,
    private readonly postsExternalRepository: PostsExternalRepository,
    private readonly blogsExternalRepository: BlogsExternalRepository,
  ) {}

  async createPostForBlog(
    dto: CreatePostForBlogDto,
    blogId: string,
  ): Promise<string> {
    const blog: BlogDocument =
      await this.blogsExternalRepository.getBlogById(blogId);

    const newPost: PostDocument = this.PostModel.createInstancePostForBlog(
      dto,
      blog.name,
      blogId,
    );

    const postId: string =
      await this.postsExternalRepository.createPost(newPost);

    if (!postId) {
      throw new NotFoundException('Failed to create Post');
    }

    return postId;
  }
}
