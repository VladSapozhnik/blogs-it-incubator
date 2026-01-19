import { HydratedDocument, Model, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
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

  static createInstance(
    userId: Types.ObjectId,
    deviceId: string,
    ip: string,
    title: string,
    lastActiveDate: Date,
    expiresAt: Date,
  ): SecurityDeviceDocument {
    const session = new this();

    session.userId = userId;
    session.deviceId = deviceId;
    session.ip = ip;
    session.title = title;
    session.lastActiveDate = lastActiveDate;
    session.expiresAt = expiresAt;

    return session as SecurityDeviceDocument;
  }

  updateSession(
    ip: string,
    title: string,
    lastActiveDate: Date,
    expiresAt: Date,
  ) {
    this.ip = ip;
    this.title = title;
    this.lastActiveDate = lastActiveDate;
    this.expiresAt = expiresAt;
  }
}

export const SecurityDeviceSchema =
  SchemaFactory.createForClass(SecurityDevice);

SecurityDeviceSchema.loadClass(SecurityDevice);

export type SecurityDeviceDocument = HydratedDocument<SecurityDevice>;

export type SecurityDeviceModelType = Model<SecurityDeviceDocument> &
  typeof SecurityDevice;
