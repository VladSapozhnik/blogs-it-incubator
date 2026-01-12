import {
  Blog,
  BlogDocument,
  type BlogModelType,
} from '../entities/blog.entity';
import { InjectModel } from '@nestjs/mongoose';
import { HttpStatus, Injectable } from '@nestjs/common';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';

@Injectable()
export class BlogsExternalRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType) {}

  async getBlogById(id: string): Promise<BlogDocument> {
    const findBlog: BlogDocument | null = await this.BlogModel.findOne({
      _id: id,
    });

    if (!findBlog) {
      throw new DomainException({
        status: HttpStatus.NOT_FOUND,
        errorsMessages: [
          {
            message: "Blog doesn't exist",
            field: 'blog',
          },
        ],
      });
    }

    return findBlog;
  }
}
