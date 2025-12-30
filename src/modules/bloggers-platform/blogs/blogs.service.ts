import { BadRequestException, Injectable } from '@nestjs/common';
import { BlogsRepository } from './blogs.repository';
import { Blog, BlogDocument, type BlogModelType } from './entities/blog.entity';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { CreateBlogDto } from './dto/create-blog.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private blogModel: BlogModelType,
    private readonly blogsRepository: BlogsRepository,
  ) {}

  async createBlog(dto: CreateBlogDto): Promise<string> {
    const newBlog: BlogDocument = this.blogModel.createInstance(dto);

    const blogId: string = await this.blogsRepository.createBlog(newBlog);

    if (!blogId) {
      throw new BadRequestException('Failed to create blog');
    }

    return blogId;
  }

  async updateBlog(id: string, dto: UpdateBlogDto) {
    const isBlog: BlogDocument | null =
      await this.blogsRepository.getBlogById(id);

    isBlog.name = dto.name;
    isBlog.description = dto.description;
    isBlog.websiteUrl = dto.websiteUrl;

    await this.blogsRepository.updateBlog(isBlog);
  }

  async removeBlogById(id: string) {
    const isBlog: BlogDocument | null =
      await this.blogsRepository.getBlogById(id);

    await this.blogsRepository.removeBlogById(isBlog);
  }
}
