import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryService } from './delivery.service';
import { DeliveryConfigurationService } from './delivery-config.service';
import { GeoApiService } from '../geoapi/geoapi.service';
import { Repository } from 'typeorm';
import { Delivery } from './entities/delivery.entity';
import { DeliveryCalculation } from './entities/delivery-calculation.entity';
import { RepoTags, StoreType, StoreWithDistanceToCustomer } from '../../types';
import { fakerPT_BR as faker } from '@faker-js/faker';
import { DeliveryConfiguration } from './entities/delivery-config.entity';

describe('DeliveryService', () => {
  let service: DeliveryService;
  let deliveryConfigService: DeliveryConfigurationService;
  let geoApiService: GeoApiService;
  let deliveryRepository: Repository<Delivery>;
  let deliveryCalculationRepository: Repository<DeliveryCalculation>;

  const mockStore: StoreWithDistanceToCustomer = {
    storeId: faker.string.uuid(),
    storeName: faker.company.name(),
    postalCode: '63021038',
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
  const mockDeliveryCalculation: DeliveryCalculation = {
    id: faker.string.uuid(),
    storeID: mockStore.storeId,
    cep: '63050750',
    deliveryType: StoreType.LOJA,
    shippingOptions: [
      {
        description: 'Motoboy da loja',
        price: 'R$ 15,00',
        prazo: '5 dias úteis',
      },
    ],
    expiresAt: new Date(Date.now() + 10000), // Definindo um prazo de expiração
  };
  const mockGeoApiService = {
    getShippingOptions: jest.fn().mockResolvedValue([
      { name: 'Correios', price: 'R$ 20,00', prazo: 3 },
    ]),
  };

  mockStore.deliveryConfigurations = [mockDeliveryConfig]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryService,
        {
          provide: DeliveryConfigurationService,
          useValue: {
            getOrCreateStoreConfig: jest.fn().mockResolvedValue([]),
            createDefaultConfigs: jest.fn().mockResolvedValue([]),
            getDeliveryConfigs: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: GeoApiService,
          useValue: mockGeoApiService,
        },
        {
          provide: RepoTags.DELIVERY,
          useValue: {
            findOne: jest.fn().mockResolvedValue(undefined), // Simula a ausência de delivery no banco
            save: jest.fn(),
          },
        },
        {
          provide: RepoTags.DELIVERY_CALCULATION,
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockDeliveryCalculation), // Retorna mock de DeliveryCalculation
            create: jest.fn().mockReturnValue(mockDeliveryCalculation),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DeliveryService>(DeliveryService);
    deliveryConfigService = module.get<DeliveryConfigurationService>(DeliveryConfigurationService);
    geoApiService = module.get<GeoApiService>(GeoApiService);
    deliveryRepository = module.get<Repository<Delivery>>(RepoTags.DELIVERY);
    deliveryCalculationRepository = module.get<Repository<DeliveryCalculation>>(
      RepoTags.DELIVERY_CALCULATION
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get or create delivery config', async () => {
    const result = await service.getOrCreateDeliveryConfig(mockStore);
    expect(result).toEqual([]); // Espera-se que o método getOrCreateStoreConfig do deliveryConfigService seja chamado
    expect(deliveryConfigService.getOrCreateStoreConfig).toHaveBeenCalledWith(mockStore);
  });

  it('should create default delivery configs', async () => {
    const result = await service.createDefaultDeliveryConfigs(mockStore);
    expect(result).toEqual([]); // Espera-se que o método createDefaultConfigs do deliveryConfigService seja chamado
    expect(deliveryConfigService.createDefaultConfigs).toHaveBeenCalledWith(mockStore);
  });

  it('should get delivery configs', async () => {
    const result = await service.getDeliveryConfig(mockStore);
    expect(result).toEqual([]); // Espera-se que o método getDeliveryConfigs do deliveryConfigService seja chamado
    expect(deliveryConfigService.getDeliveryConfigs).toHaveBeenCalledWith(mockStore);
  });

  it('should calculate shipping options for in-range stores', async () => {
    const storesWithDistance = [
      {
        ...mockStore,
        distance: { distanceMeters: 10000, duration: '36000' }, // Dentro do alcance
      },
    ];

    const result = await service.calculateShippingOptions(
      storesWithDistance,
      '63050750'
    );

    expect(result).toHaveLength(1); // Espera-se que uma loja seja processada
    expect(mockGeoApiService.getShippingOptions).toHaveBeenCalledWith(
      mockStore.postalCode,
      '63050750',
      8
    ); // Verifica se a chamada ao serviço de API de frete foi feita corretamente
    expect(deliveryCalculationRepository.save).toHaveBeenCalledTimes(1); // Verifica se o cálculo de entrega foi salvo
  });

  it('should calculate shipping options for out-of-range stores', async () => {
    const storesWithDistance = [
      {
        ...mockStore,
        distance: { distanceMeters: 60000, duration: '36000' }, // Fora do alcance
      },
    ];

    const result = await service.calculateShippingOptions(
      storesWithDistance,
      '63050750'
    );

    expect(result).toHaveLength(1); // Espera-se que uma loja seja processada
  });

  it('should handle existing delivery calculation and return it', async () => {
    const storesWithDistance = [
      {
        ...mockStore,
        distance: { distanceMeters: 10000, duration: '36000' },
        deliveryConfigurations: [
          {
            id: faker.string.uuid(),
            extraDeliveryTime: 0,
            storeID: mockStore.storeId,
            deliveryType: StoreType.LOJA,
            prazoMotoboy: 2,
            store: mockStore,
            shippingTimeInDays: faker.number.int({ min: 1, max: 5 }),
            extraDeliveryDays: 0,
            active: true
          },
        ],
      },
    ];

    const result = await service.calculateShippingOptions(
      storesWithDistance,
      '63050750'
    );

    expect(result).toHaveLength(1); // Espera-se que o cálculo de entrega existente seja retornado
    expect(deliveryCalculationRepository.findOne).toHaveBeenCalled(); // Verifica se o cálculo existente foi procurado
  });
});
