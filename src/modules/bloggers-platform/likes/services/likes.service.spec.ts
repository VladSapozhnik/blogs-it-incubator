import { Test, TestingModule } from '@nestjs/testing';
import { LikesExternalService } from './likes.external.service';

describe('LikesExternalService', () => {
  let service: LikesExternalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LikesExternalService],
    }).compile();

    service = module.get<LikesExternalService>(LikesExternalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
