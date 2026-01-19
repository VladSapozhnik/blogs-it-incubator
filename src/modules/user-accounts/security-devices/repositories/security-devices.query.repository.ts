import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  SecurityDevice,
  SecurityDeviceDocument,
  type SecurityDeviceModelType,
} from '../entities/security-device.entity';
import { Types } from 'mongoose';

@Injectable()
export class SecurityDevicesQueryRepository {
  constructor(
    @InjectModel(SecurityDevice.name)
    private SecurityDeviceModel: SecurityDeviceModelType,
  ) {}
  async findDeviceSessionByUserId(
    userId: string,
  ): Promise<SecurityDeviceDocument[]> {
    return this.SecurityDeviceModel.find({
      userId: new Types.ObjectId(userId),
    });
  }
}
