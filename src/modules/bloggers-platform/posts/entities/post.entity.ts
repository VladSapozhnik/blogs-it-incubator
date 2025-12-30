import { HydratedDocument, Model, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CreatePostDto } from '../dto/create-post.dto';

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true, min: 1 })
  title: string;
  @Prop({ required: true, min: 1 })
  shortDescription: string;
  @Prop({ required: true, min: 1 })
  content: string;
  @Prop({ required: true })
  blogId: Types.ObjectId;
  @Prop({ required: true, min: 1 })
  blogName: string;
  createdAt: Date;
  updatedAt: Date;

  static createInstance(dto: CreatePostDto, blogName: string): PostDocument {
    const post = new this();

    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = dto.blogId;
    post.blogName = blogName;

    return post as PostDocument;
  }
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.loadClass(Post);

export type PostDocument = HydratedDocument<Post>;

export type PostModelType = Model<PostDocument> & typeof Post;
