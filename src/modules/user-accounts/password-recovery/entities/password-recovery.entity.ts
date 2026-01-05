import { HydratedDocument, Model, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class PasswordRecovery {
  @Prop({ required: true })
  userId: Types.ObjectId;
  @Prop({ required: true })
  recoveryCode: string;
  @Prop({ required: true })
  expirationDate: Date;
  @Prop({ required: true })
  isUsed: boolean;
}

export const PasswordRecoverySchema =
  SchemaFactory.createForClass(PasswordRecovery);

export type PasswordRecoveryDocument = HydratedDocument<PasswordRecovery>;

export type PasswordRecoveryModel = Model<PasswordRecoveryDocument> &
  typeof PasswordRecovery;
