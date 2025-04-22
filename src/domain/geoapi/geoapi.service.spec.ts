import { Test, TestingModule } from '@nestjs/testing';
import { GmapsService } from './gmaps/gmaps.service';
import { ViaCepService } from './via-cep/via-cep.service';
import { MelhorEnvioService } from './melhorEnvio/melhorEnvio.service';
import { UnprocessableEntityException } from '@nestjs/common';
import { CreateStoreDto } from '../store/dto/create-store.dto';
import { GeoApiService } from './geoapi.service';

describe('GeoApiService', () => {
  let service: GeoApiService;
  let gmapsService: GmapsService;
  let viaCepService: ViaCepService;
  let melhorEnvioService: MelhorEnvioService;

  const mockCoordinates = { latitude: -23.5, longitude: -46.6 };

  const mockViaCepResponse = {
    cep: '01001-000',
    logradouro: 'Praça da Sé',
    complemento: '',
    bairro: 'Sé',
    localidade: 'São Paulo',
    uf: 'SP',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeoApiService,
        {
          provide: GmapsService,
          useValue: {
            getGeoLocationByAddress: jest.fn(),
            calculateDistance: jest.fn(),
          },
        },
        {
          provide: ViaCepService,
          useValue: {
            lookup: jest.fn(),
          },
        },
        {
          provide: MelhorEnvioService,
          useValue: {
            getFreteOptions: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GeoApiService>(GeoApiService);
    gmapsService = module.get(GmapsService);
    viaCepService = module.get(ViaCepService);
    melhorEnvioService = module.get(MelhorEnvioService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('getAddressDetailsByPostalCode', () => {
    it('should return address details and coordinates', async () => {
      viaCepService.lookup = jest.fn().mockResolvedValue(mockViaCepResponse);
      gmapsService.getGeoLocationByAddress = jest.fn().mockResolvedValue(mockCoordinates);

      const result = await service.getAddressDetailsByPostalCode('01001-000');
      expect(result).toEqual({ ...mockViaCepResponse, ...mockCoordinates });
    });

    it('should throw if postal code is invalid', async () => {
      viaCepService.lookup = jest.fn().mockResolvedValue({ erro: true });

      await expect(service.getAddressDetailsByPostalCode('99999-999')).rejects.toThrow(UnprocessableEntityException);
    });

    it('should throw if coordinates cannot be resolved', async () => {
      viaCepService.lookup = jest.fn().mockResolvedValue(mockViaCepResponse);
      gmapsService.getGeoLocationByAddress = jest.fn().mockResolvedValue(null);

      await expect(service.getAddressDetailsByPostalCode('01001-000')).rejects.toThrow(UnprocessableEntityException);
    });
  });

  describe('getCoordinatesByStore', () => {
    it('should return coordinates for store address', async () => {
      const store: CreateStoreDto = {
        country: 'Brasil',
        address1: 'Rua X',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '01001-000',
      } as any;

      gmapsService.getGeoLocationByAddress = jest.fn().mockResolvedValue(mockCoordinates);

      const result = await service.getCoordinatesByStore(store);
      expect(result).toEqual(mockCoordinates);
    });
  });

  describe('getCoordinatesByViaCepDetails', () => {
    it('should return coordinates for viaCep address', async () => {
      gmapsService.getGeoLocationByAddress = jest.fn().mockResolvedValue(mockCoordinates);

      const result = await service.getCoordinatesByViaCepDetails(mockViaCepResponse as any);
      expect(result).toEqual(mockCoordinates);
    });
  });

  describe('getRouteDistance', () => {
    it('should return calculated distance', async () => {
      const routeResult = { distance: 1000, duration: 300 };
      gmapsService.calculateDistance = jest.fn().mockResolvedValue(routeResult);

      const result = await service.getRouteDistance(mockCoordinates, mockCoordinates);
      expect(result).toEqual(routeResult);
    });
  });

  describe('getShippingOptions', () => {
    it('should return shipping options from MelhorEnvio', async () => {
      const shippingOptions = [{ name: 'PAC' }, { name: 'SEDEX' }];
      melhorEnvioService.getFreteOptions = jest.fn().mockResolvedValue(shippingOptions);

      const result = await service.getShippingOptions('01001-000', '20040-010', 1);
      expect(result).toEqual(shippingOptions);
    });
  });
});
