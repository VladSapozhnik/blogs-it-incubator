import { CreatePostDto } from './dto/create-post.dto';
import { BlogDocument } from '../blogs/entities/blog.entity';
import { Post, PostDocument, type PostModelType } from './entities/post.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostsRepository } from './posts.repository';
import { BlogsExternalRepository } from '../blogs/blogs.external.repository';

@Injectable()
export class PostsExternalService {
  constructor(
    @InjectModel(Post.name) private readonly PostModel: PostModelType,
    private readonly postsRepository: PostsRepository,
    private readonly blogsExternalRepository: BlogsExternalRepository,
  ) {}

  async createPostForBlog(dto: CreatePostDto): Promise<string> {
    const blog: BlogDocument = await this.blogsExternalRepository.getBlogById(
      dto.blogId.toString(),
    );

    const newPost: PostDocument = this.PostModel.createInstance(dto, blog.name);

    const postId: string = await this.postsRepository.createPost(newPost);

    if (!postId) {
      throw new BadRequestException('Failed to create Post');
    }

    return postId;
  }
}
