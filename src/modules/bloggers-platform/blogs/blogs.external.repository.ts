import { Blog, BlogDocument, type BlogModelType } from './entities/blog.entity';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class BlogsExternalRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType) {}

  async getBlogById(id: string): Promise<BlogDocument> {
    const findBlog: BlogDocument | null = await this.BlogModel.findOne({
      _id: id,
    });

    if (!findBlog) {
      throw new BadRequestException("Blog doesn't exist");
    }

    return findBlog;
  }
}
