import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';

@Schema()
export class SecurityDevice {
  @Prop({ required: true })
  userId: Types.ObjectId;
  @Prop({ required: true })
  deviceId: string;
  @Prop({ required: true })
  ip: string;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  lastActiveDate: Date;
  @Prop({ required: true })
  expiresAt: Date;
}

export const SecurityDeviceSchema =
  SchemaFactory.createForClass(SecurityDevice);

SecurityDeviceSchema.loadClass(SecurityDevice);

export type SecurityDeviceDocument = HydratedDocument<SecurityDevice>;

export type SecurityDeviceModel = Model<SecurityDeviceDocument> &
  typeof SecurityDevice;
