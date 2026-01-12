import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { BlogDocument } from '../../blogs/entities/blog.entity';
import { PostsRepository } from '../repositories/posts.repository';
import {
  Post,
  PostDocument,
  type PostModelType,
} from '../entities/post.entity';
import { BlogsExternalRepository } from '../../blogs/repositories/blogs.external.repository';
import { InjectModel } from '@nestjs/mongoose';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly PostModel: PostModelType,
    private readonly postsRepository: PostsRepository,
    private readonly blogsExternalRepository: BlogsExternalRepository,
  ) {}

  async createPost(dto: CreatePostDto): Promise<string> {
    const blog: BlogDocument = await this.blogsExternalRepository.getBlogById(
      dto.blogId.toString(),
    );

    const newPost: PostDocument = this.PostModel.createInstance(dto, blog.name);

    const postId: string = await this.postsRepository.createPost(newPost);

    if (!postId) {
      throw new DomainException({
        status: HttpStatus.BAD_REQUEST,
        errorsMessages: [
          {
            message: 'Failed to create Post',
            field: 'post',
          },
        ],
      });
    }

    return postId;
  }

  async updatePost(id: string, dto: UpdatePostDto) {
    const blog: BlogDocument = await this.blogsExternalRepository.getBlogById(
      dto.blogId.toString(),
    );

    const existPost: PostDocument = await this.postsRepository.findPostById(
      id.toString(),
    );

    existPost.updatePost(dto, blog.name);

    await this.postsRepository.updatePost(existPost);
  }

  async removePost(id: string) {
    const existPost: PostDocument = await this.postsRepository.findPostById(
      id.toString(),
    );

    await this.postsRepository.removePost(existPost);
  }
}
