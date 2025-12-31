import { Test, TestingModule } from '@nestjs/testing';
import { CommentsQueryService } from './comments.query.service';

describe('CommentsQueryService', () => {
  let service: CommentsQueryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentsQueryService],
    }).compile();

    service = module.get<CommentsQueryService>(CommentsQueryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
