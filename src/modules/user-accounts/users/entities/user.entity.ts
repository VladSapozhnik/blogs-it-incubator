import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { HydratedDocument, Model } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, min: 1 })
  login: string;
  @Prop({ required: true, min: 1 })
  email: string;
  createdAt: Date;
  updatedAt: Date;

  static createInstance(dto: CreateUserDto): UserDocument {
    const user = new this();

    user.login = dto.login;
    user.email = dto.email;

    return user as UserDocument;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.loadClass(User);

export type UserDocument = HydratedDocument<User>;

export type UserModelType = Model<UserDocument> & typeof User;
