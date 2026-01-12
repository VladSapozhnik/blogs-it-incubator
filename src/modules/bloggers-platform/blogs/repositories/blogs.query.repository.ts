import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Blog,
  BlogDocument,
  type BlogModelType,
} from '../entities/blog.entity';
import { GetBlogsQueryParamsDto } from '../dto/blog-query-input.dto';
import { BlogsMapper } from '../mappers/blogs.mapper';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view.dto';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: BlogModelType,
  ) {}
  async getBlogs(queryDto: GetBlogsQueryParamsDto) {
    const filter: Record<string, any> = queryDto.buildBlogsFilter();

    const blogs: BlogDocument[] = await this.blogModel
      .find(filter)
      .sort({ [queryDto.sortBy]: queryDto.sortDirection })
      .skip(queryDto.calculateSkip())
      .limit(queryDto.pageSize);

    const totalCount: number = await this.blogModel.countDocuments(filter);

    const items: BlogsMapper[] = blogs.map(BlogsMapper.mapToView);

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: queryDto.pageNumber,
      size: queryDto.pageSize,
    });
  }

  async getBlogById(id: string): Promise<BlogsMapper> {
    const findBlog: BlogDocument | null = await this.blogModel.findOne({
      _id: id,
    });

    if (!findBlog) {
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

    return BlogsMapper.mapToView(findBlog);
  }
}
