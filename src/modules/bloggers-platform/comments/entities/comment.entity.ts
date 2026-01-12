import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true })
  postId: Types.ObjectId;
  @Prop({ required: true })
  content: string;
  @Prop({
    type: {
      userId: { type: Types.ObjectId, required: true },
      userLogin: { type: String, required: true },
    },
    required: true,
  })
  commentatorInfo: {
    userId: Types.ObjectId;
    userLogin: string;
  };
  createdAt: Date;
  updatedAt: Date;

  static createInstance(
    postId: string,
    content: string,
    userId: string,
    userLogin: string,
  ) {
    const comment = new this();

    comment.postId = new Types.ObjectId(postId);
    comment.content = content;
    comment.commentatorInfo.userId = new Types.ObjectId(userId);
    comment.commentatorInfo.userLogin = userLogin;

    return comment as CommentDocument;
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.loadClass(Comment);

export type CommentDocument = HydratedDocument<Comment>;

export type CommentModelType = Model<CommentDocument> & typeof Comment;
