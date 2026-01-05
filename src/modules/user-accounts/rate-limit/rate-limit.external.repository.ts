import { Injectable } from '@nestjs/common';
import {
  RateLimit,
  RateLimitDocument,
  type RateLimitModel,
} from './entities/rate-limit.entity';
import { InjectModel } from '@nestjs/mongoose';
import { subSeconds } from 'date-fns';

@Injectable()
export class RateLimitExternalRepository {
  constructor(
    @InjectModel(RateLimit.name)
    private readonly RateLimitModel: RateLimitModel,
  ) {}

  async addAttempt(data: RateLimitDocument): Promise<string> {
    const result: RateLimitDocument = await data.save();

    return result._id.toString();
  }

  async getAttemptsCount(ip: string, url: string): Promise<number> {
    const tenSecondsAgo: Date = subSeconds(new Date(), 10);

    return this.RateLimitModel.countDocuments({
      ip,
      url,
      date: { $gt: tenSecondsAgo },
    });
  }
}
