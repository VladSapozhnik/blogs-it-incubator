import { Types } from 'mongoose';

export class CreatePostDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId: Types.ObjectId;
}
