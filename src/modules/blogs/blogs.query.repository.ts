import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, type BlogModelType } from './entities/blog.entity';
import { PaginatedViewDto } from '../../core/dto/base.paginated.view.dto';
// import { SkipOffset } from '../../core/helpers/skip.offset';
import { GetBlogsQueryParamsDto } from './dto/blog-query-input.dto';
import { BlogsMapper } from './mappers/blogs.mapper';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: BlogModelType,
  ) {}
  async getBlogs(queryDto: GetBlogsQueryParamsDto) {
    // const skip: number = SkipOffset.getSkip(
    //   queryDto.pageNumber,
    //   queryDto.pageSize,
    // );
    //
    const filter: Record<string, any> = {};

    if (queryDto.searchNameTerm) {
      filter.name = { $regex: queryDto.searchNameTerm, $options: 'i' };
    }

    const blogs: BlogDocument[] = await this.blogModel
      .find(filter)
      .sort({ [queryDto.sortBy]: queryDto.sortDirection })
      .skip(queryDto.calculateSkip())
      .limit(queryDto.pageSize);

    const totalCount: number = await this.blogModel.countDocuments(filter);

    const items: BlogsMapper[] = blogs.map(BlogsMapper.mapToView);

    // const pagination: PaginatedMetaType = buildPaginationHelper(
    //   totalCount,
    //   queryDto.pageNumber,
    //   queryDto.pageSize,
    // );
    //
    // return paginatedListMapper(items, pagination, blogMapper);

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
      throw new NotFoundException('Blog not found');
    }

    return BlogsMapper.mapToView(findBlog);
  }
}
