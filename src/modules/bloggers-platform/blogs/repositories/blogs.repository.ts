import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Blog,
  BlogDocument,
  type BlogModelType,
} from '../entities/blog.entity';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: BlogModelType) {}

  async getBlogById(id: string): Promise<BlogDocument> {
    const existBlog: BlogDocument | null = await this.blogModel.findOne({
      _id: id,
    });

    if (!existBlog) {
      throw new DomainException({
        status: HttpStatus.NOT_FOUND,
        errorsMessages: [
          {
            message: 'Blog not found',
            field: 'blog',
          },
        ],
      });
    }

    return existBlog;
  }

  async createBlog(newBlog: BlogDocument): Promise<string> {
    const result: BlogDocument = await newBlog.save();
    return result._id.toString();
  }

  async updateBlog(isBlog: BlogDocument): Promise<string> {
    const result: BlogDocument = await isBlog.save();

    return result._id.toString();
  }

  async removeBlogById(blog: BlogDocument): Promise<string> {
    await blog.deleteOne();

    return blog._id.toString();
  }
}
