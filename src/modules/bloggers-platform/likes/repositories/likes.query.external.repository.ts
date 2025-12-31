import { LikeTargetEnum } from '../enums/like-target.enum';
import { InjectModel } from '@nestjs/mongoose';
import {
  Like,
  LikeDocument,
  type LikeModelType,
} from '../entities/like.entity';
import { Injectable } from '@nestjs/common';
import { LikeStatusEnum } from '../enums/like-status.enum';

@Injectable()
export class LikesQueryExternalRepository {
  constructor(
    @InjectModel(Like.name) private readonly LikeModel: LikeModelType,
  ) {}

  async getLikesAndDislikesComment(
    targetId: string,
    targetType: LikeTargetEnum,
  ) {
    const [likesCount, dislikesCount] = await Promise.all([
      this.LikeModel.countDocuments({
        targetId,
        targetType,
        status: LikeStatusEnum.Like,
      }),
      this.LikeModel.countDocuments({
        targetId,
        targetType,
        status: LikeStatusEnum.Dislike,
      }),
    ]);

    return {
      likesCount,
      dislikesCount,
    };
  }

  async findLike(
    userId: string,
    targetId: string,
    targetType: LikeTargetEnum,
  ): Promise<LikeDocument | null> {
    return this.LikeModel.findOne({
      userId: userId,
      targetId: targetId,
      targetType,
    });
  }

  async findNewestLikes(
    targetId: string,
    targetType: LikeTargetEnum,
    likeCounts: number = 3,
  ): Promise<LikeDocument[]> {
    return this.LikeModel.find({
      targetId,
      targetType,
      status: LikeStatusEnum.Like,
    })
      .sort({ createdAt: -1 })
      .limit(likeCounts);
  }
}
