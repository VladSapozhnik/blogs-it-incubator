import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateBlogDto } from '../dto/create-blog.dto';

@Schema({ timestamps: true })
export class Blog {
  @Prop({ required: true, min: 1, max: 255 })
  name: string;
  @Prop({ required: true, min: 1 })
  description: string;
  @Prop({ required: true, min: 1 })
  websiteUrl: string;
  @Prop({ required: true, default: false })
  isMembership: boolean;
  createdAt: Date;

  static createInstance(dto: CreateBlogDto): BlogDocument {
    const blog = new this();
    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;
    blog.isMembership = false;
    return blog as BlogDocument;
  }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

BlogSchema.loadClass(Blog);

export type BlogDocument = HydratedDocument<Blog>;

export type BlogModelType = Model<BlogDocument> & typeof Blog;
