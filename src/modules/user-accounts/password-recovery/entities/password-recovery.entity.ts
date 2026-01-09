import { HydratedDocument, Model, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { add } from 'date-fns/add';
import { randomUUID } from 'node:crypto';
import { HttpStatus } from '@nestjs/common';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';

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

  static createForUser(userId: string): PasswordRecoveryDocument {
    const recovery = new this();
    recovery.userId = new Types.ObjectId(userId);
    recovery.recoveryCode = randomUUID();
    recovery.expirationDate = add(new Date(), { minutes: 30 });
    recovery.isUsed = false;

    return recovery as PasswordRecoveryDocument;
  }

  validateRecoveryCode(): void {
    if (this.isUsed || this.expirationDate < new Date()) {
      throw new DomainException({
        status: HttpStatus.BAD_REQUEST,
        errorsMessages: [
          {
            message: 'Code is invalid',
            field: 'code',
          },
        ],
      });
    }
  }

  markAsUsed(): void {
    this.isUsed = true;
  }
}

export const PasswordRecoverySchema =
  SchemaFactory.createForClass(PasswordRecovery);

export type PasswordRecoveryDocument = HydratedDocument<PasswordRecovery>;

export type PasswordRecoveryModel = Model<PasswordRecoveryDocument> &
  typeof PasswordRecovery;
