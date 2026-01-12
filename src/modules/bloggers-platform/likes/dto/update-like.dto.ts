import { LikeStatusEnum } from '../enums/like-status.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateLikeDto {
  @IsNotEmpty()
  @IsEnum(LikeStatusEnum)
  likeStatus: LikeStatusEnum;
}
