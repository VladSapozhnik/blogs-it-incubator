import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { HydratedDocument, Model } from 'mongoose';
import { BadRequestException } from '@nestjs/common';

export type EmailConfirmationType = {
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
};

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: {
      confirmationCode: { type: String, required: true },
      expirationDate: { type: Date, required: true },
      isConfirmed: { type: Boolean, required: true },
    },
    required: true,
  })
  emailConfirmation: EmailConfirmationType;
  createdAt: Date;
  updatedAt: Date;

  static createInstance(
    dto: CreateUserDto,
    hash: string,
    emailConfirmation: EmailConfirmationType,
  ): UserDocument {
    const user = new this();

    user.login = dto.login;
    user.password = hash;
    user.email = dto.email;
    user.emailConfirmation = emailConfirmation;

    return user as UserDocument;
  }

  setPassword(newHash: string): void {
    this.password = newHash;
  }

  resendEmail(code: string, expirationDate: Date) {
    this.emailConfirmation.confirmationCode = code;
    this.emailConfirmation.expirationDate = expirationDate;
    this.emailConfirmation.isConfirmed = false;
  }

  confirmEmail() {
    if (this.emailConfirmation.isConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    if (this.emailConfirmation.expirationDate < new Date()) {
      throw new BadRequestException('Confirmation code expired');
    }

    this.emailConfirmation.isConfirmed = true;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.loadClass(User);

export type UserDocument = HydratedDocument<User>;

export type UserModelType = Model<UserDocument> & typeof User;
