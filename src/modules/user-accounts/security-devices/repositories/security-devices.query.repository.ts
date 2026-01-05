import { Injectable } from '@nestjs/common';
import {
  SecurityDevice,
  SecurityDeviceDocument,
  type SecurityDeviceModel,
} from '../entities/security-device.entity';
import { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SecurityDevicesQueryRepository {
  constructor(
    @InjectModel(SecurityDevice.name)
    private readonly SecurityDeviceModel: SecurityDeviceModel,
  ) {}

  async findDeviceSessionByUserId(
    userId: string,
  ): Promise<SecurityDeviceDocument[]> {
    return this.SecurityDeviceModel.find({
      userId: new Types.ObjectId(userId),
    });
  }
}
