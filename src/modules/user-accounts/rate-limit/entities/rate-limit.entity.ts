import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema()
export class RateLimit {
  @Prop({ required: true })
  ip: string;
  @Prop({ required: true })
  url: string;
  @Prop({ required: true })
  date: Date;
}

export const RateLimitSchema = SchemaFactory.createForClass(RateLimit);

RateLimitSchema.loadClass(RateLimit);

export type RateLimitDocument = HydratedDocument<RateLimit>;

export type RateLimitModel = Model<RateLimitDocument> & typeof RateLimit;
