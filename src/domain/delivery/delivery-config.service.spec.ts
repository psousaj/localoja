import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryConfigurationService } from './delivery-config.service';

describe('StoreConfigService', () => {
  let service: DeliveryConfigurationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryConfigurationService],
    }).compile();

    service = module.get<DeliveryConfigurationService>(DeliveryConfigurationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
