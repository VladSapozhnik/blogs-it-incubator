import { UpdateResult } from 'mongoose';
import { UserDocument } from '../../../user-accounts/users/entities/user.entity';
import { LikeTargetEnum } from '../enums/like-target.enum';
import { LikeStatusEnum } from '../enums/like-status.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Like, type LikeModelType } from '../entities/like.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LikesRepository {
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
        userId: user._id,
        login: user.login,
        targetId: targetId,
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
