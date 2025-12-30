import { Types } from 'mongoose';

export class UpdatePostDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId: Types.ObjectId;
}
