import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryConfigurationService } from './delivery-config.service';
import { DeliveryConfiguration } from './entities/delivery-config.entity';
import { StoreWithDistanceToCustomer } from '../../types';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StoreType } from '../../types';
import { fakerPT_BR as faker } from '@faker-js/faker';

describe('DeliveryConfigurationService', () => {
  let service: DeliveryConfigurationService;
  let deliveryConfigRepo;

  const mockStore: StoreWithDistanceToCustomer = {
    storeId: faker.string.uuid(),
    storeName: faker.company.name(),
    postalCode: faker.location.zipCode({ state: 'CE' }),
    city: 'Test City',
    shippingTimeInDays: 2,
    takeOutInStore: true,
    address1: faker.location.streetAddress(),
    state: 'CE',
    country: 'BR',
    type: StoreType.PDV,
    latitude: faker.location.latitude().toString(),
    longitude: faker.location.longitude().toString(),
    distance: { distanceMeters: 30000, duration: '36000' },
  };

  const mockDeliveryConfig: DeliveryConfiguration = {
    id: faker.string.uuid(),
    // extraDeliveryTime: 0,
    storeID: mockStore.storeId,
    deliveryType: StoreType.LOJA,
    prazoMotoboy: 2,
    store: mockStore,
    shippingTimeInDays: faker.number.int({ min: 1, max: 5 }),
    extraDeliveryDays: 0,
    active: true
  }

  beforeEach(async () => {
    deliveryConfigRepo = {
      findOne: jest.fn().mockResolvedValue(mockDeliveryConfig),
      save: jest.fn().mockResolvedValue([mockDeliveryConfig]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryConfigurationService,
        {
          provide: getRepositoryToken(DeliveryConfiguration),
          useValue: deliveryConfigRepo, // Mock do repositório
        },
      ],
    }).compile();

    service = module.get<DeliveryConfigurationService>(DeliveryConfigurationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return delivery configurations for store', async () => {
    const configs = await service.getDeliveryConfigs(mockStore);
    expect(configs).toEqual([mockDeliveryConfig]); // Espera-se que retorne o mock de configuração
    expect(deliveryConfigRepo.findOne).toHaveBeenCalledTimes(2); // Verifica se o método foi chamado 2 vezes
  });

  it('should create default delivery configurations if missing', async () => {
    // Simula a ausência de uma configuração para o PDV
    deliveryConfigRepo.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(mockDeliveryConfig);

    const configs = await service.createDefaultConfigs(mockStore);

    expect(configs.length).toBe(2); // Espera-se que dois objetos sejam retornados: um para LOJA e um para PDV
    expect(deliveryConfigRepo.save).toHaveBeenCalledTimes(1); // Verifica se o método save foi chamado
  });

  it('should return existing configs or create default configs', async () => {
    // Simula o caso onde já existem configurações para LOJA e PDV
    deliveryConfigRepo.findOne.mockResolvedValueOnce(mockDeliveryConfig).mockResolvedValueOnce(mockDeliveryConfig);

    const configs = await service.getOrCreateStoreConfig(mockStore);

    expect(configs).toEqual([mockDeliveryConfig, mockDeliveryConfig]); // Espera-se que as configurações existentes sejam retornadas
  });

  it('should create default configurations if not all types are present', async () => {
    // Simula o caso onde uma configuração para LOJA existe, mas não para PDV
    deliveryConfigRepo.findOne.mockResolvedValueOnce(mockDeliveryConfig).mockResolvedValueOnce(null);

    const configs = await service.getOrCreateStoreConfig(mockStore);

    expect(configs.length).toBe(2); // Espera-se que uma nova configuração seja criada para o PDV
    expect(deliveryConfigRepo.save).toHaveBeenCalledTimes(1); // Verifica se o método save foi chamado
  });
});
