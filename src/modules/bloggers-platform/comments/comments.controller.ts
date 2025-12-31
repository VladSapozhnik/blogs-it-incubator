import { Controller, Get, Param } from '@nestjs/common';
import { CommentsQueryService } from './services/comments.query.service';
import { CommentsMapper } from './mappers/comments.mapper';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsQueryService: CommentsQueryService) {}

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CommentsMapper> {
    return this.commentsQueryService.getCommentById(id, null);
  }
}
