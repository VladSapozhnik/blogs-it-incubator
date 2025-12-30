import { LikeStatusEnum } from '../enums/like-status.enum';
import { LikeDocument } from '../entities/like.entity';

export type NewestLikeViewType = {
  addedAt: string;
  userId: string;
  login: string;
};

export type ExtendedLikesInfoType = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatusEnum;
  newestLikes: NewestLikeViewType[];
};

export const LikeInfoForPostMapper = (
  like: number,
  dislike: number,
  myStatus: LikeStatusEnum,
  newestLikes: LikeDocument[],
): ExtendedLikesInfoType => {
  return {
    likesCount: like,
    dislikesCount: dislike,
    myStatus,
    newestLikes: newestLikes.map(
      (like: LikeDocument): NewestLikeViewType => ({
        addedAt: like.createdAt.toISOString(),
        userId: like.userId.toString(),
        login: like.login,
      }),
    ),
  };
};
