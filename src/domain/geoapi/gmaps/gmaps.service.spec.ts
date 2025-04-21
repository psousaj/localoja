import { Test, TestingModule } from '@nestjs/testing';
import { GmapsService } from './gmaps.service';

describe('GmapsService', () => {
  let service: GmapsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GmapsService],
    }).compile();

    service = module.get<GmapsService>(GmapsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
