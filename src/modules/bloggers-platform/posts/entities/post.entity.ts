import { HydratedDocument, Model, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CreatePostDto } from '../dto/create-post.dto';
import { CreatePostForBlogDto } from '../dto/create-post-for-blog.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

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
    post.blogId = new Types.ObjectId(dto.blogId);
    post.blogName = blogName;

    return post as PostDocument;
  }

  static createInstancePostForBlog(
    dto: CreatePostForBlogDto,
    blogName: string,
    blogId: string,
  ): PostDocument {
    const post = new this();

    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = new Types.ObjectId(blogId);
    post.blogName = blogName;

    return post as PostDocument;
  }

  updatePost(dto: UpdatePostDto, blogName: string) {
    this.title = dto.title;
    this.shortDescription = dto.shortDescription;
    this.content = dto.content;
    this.blogName = blogName;
  }
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.loadClass(Post);

export type PostDocument = HydratedDocument<Post>;

export type PostModelType = Model<PostDocument> & typeof Post;
