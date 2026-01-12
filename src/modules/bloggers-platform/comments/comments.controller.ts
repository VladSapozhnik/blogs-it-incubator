import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentsQueryService } from './services/comments.query.service';
import { CommentsMapper } from './mappers/comments.mapper';
import { CommentsService } from './services/comments.service';
import { JwtAuthGuard } from '../../user-accounts/auth/guards/jwt-auth.guard';
import { Public } from '../../../core/decorators/public.decorator';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../../user-accounts/auth/decorator/user.decorator';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(
    private readonly commentsQueryService: CommentsQueryService,
    private readonly commentsService: CommentsService,
  ) {}

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string): Promise<CommentsMapper> {
    return this.commentsQueryService.getCommentById(id, null);
  }

  @Put(':commentId')
  updateComment(
    @User('userId') userId: string,
    @Body() updateComment: UpdateCommentDto,
    @Param('commentId') commentId: string,
  ) {
    return this.commentsService.updateComment(commentId, userId, updateComment);
  }

  @Delete(':commentId')
  removeComment(
    @User('userId') userId: string,
    @Param('commentId') commentId: string,
  ) {
    return this.commentsService.removeComment(commentId, userId);
  }
}
