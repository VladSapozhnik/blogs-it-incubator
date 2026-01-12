import { Types, UpdateResult } from 'mongoose';
import { UserDocument } from '../../../user-accounts/users/entities/user.entity';
import { LikeTargetEnum } from '../enums/like-target.enum';
import { LikeStatusEnum } from '../enums/like-status.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Like, type LikeModelType } from '../entities/like.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LikesExternalRepository {
  constructor(
    @InjectModel(Like.name) private readonly LikeModel: LikeModelType,
  ) {}

  async updateLikeStatus(
    user: UserDocument,
    targetId: string,
    targetType: LikeTargetEnum,
    likeStatus: LikeStatusEnum,
  ): Promise<boolean> {
    const result: UpdateResult = await this.LikeModel.updateOne(
      {
        userId: new Types.ObjectId(user._id),
        login: user.login,
        targetId: new Types.ObjectId(targetId),
        targetType,
      },
      {
        status: likeStatus,
      },
      { upsert: true },
    );

    return result.modifiedCount === 1;
  }
}
