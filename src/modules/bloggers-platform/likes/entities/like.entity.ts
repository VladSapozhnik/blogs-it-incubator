import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikeStatusEnum } from '../enums/like-status.enum';
import { LikeTargetEnum } from '../enums/like-target.enum';
import { HydratedDocument, Model, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Like {
  @Prop({ required: true })
  userId: Types.ObjectId;
  @Prop({ required: true })
  login: string;
  @Prop({ required: true })
  targetId: Types.ObjectId;
  @Prop({ required: true, enum: LikeTargetEnum, type: 'string' })
  targetType: LikeTargetEnum;
  @Prop({ required: true, enum: LikeStatusEnum, type: 'string' })
  status: LikeStatusEnum;
  createdAt: Date;
  updatedAt: Date;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

export type LikeDocument = HydratedDocument<Like>;

export type LikeModelType = Model<LikeDocument> & typeof Like;
