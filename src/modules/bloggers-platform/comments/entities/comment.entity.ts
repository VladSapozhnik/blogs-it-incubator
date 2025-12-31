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
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.loadClass(Comment);

export type CommentDocument = HydratedDocument<Comment>;

export type CommentModelType = Model<CommentDocument> & typeof Comment;
