import { BaseQueryParams } from '../../../core/dto/base.query-params.input-dto';
import { BlogSortFieldEnum } from '../enums/blog.sort.field.enum';

export class GetBlogsQueryParams extends BaseQueryParams {
  sortBy: BlogSortFieldEnum = BlogSortFieldEnum.CreatedAt;
  searchNameTerm: string | null = null;
}
