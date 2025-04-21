import { Test, TestingModule } from '@nestjs/testing';
import { GeoapiService } from './geoapi.service';

describe('GeoapiService', () => {
  let service: GeoapiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeoapiService],
    }).compile();

    service = module.get<GeoapiService>(GeoapiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
