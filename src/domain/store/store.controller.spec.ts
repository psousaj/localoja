import { Test, TestingModule } from '@nestjs/testing';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { PaginatedStoreWithFreteResponse } from '../dto/pagination.dto';
import { StoreResponseDto } from './dto/store-response.dto';
import { ConflictException } from '@nestjs/common';

describe('StoreController', () => {
  let controller: StoreController;
  let service: StoreService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByUf: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findFreteOptions: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreController],
      providers: [
        {
          provide: StoreService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<StoreController>(StoreController);
    service = module.get<StoreService>(StoreService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should create a store', async () => {
    const dto: CreateStoreDto = { storeName: 'Nova Loja', state: 'SP' } as any;
    const saved = { ...dto, storeId: 'uuid-123' };

    mockService.create.mockResolvedValue(saved);

    const result = await controller.create(dto);
    expect(result).toEqual(expect.objectContaining({ storeName: 'Nova Loja' }));
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should list all stores paginated', async () => {
    const paginated = { limit: 10, offset: 0 } as any;
    const mockData = {
      stores: [{ storeId: 'uuid-1', storeName: 'Loja 1' }],
      total: 1,
      offset: 0,
      limit: 10,
    };

    mockService.findAll.mockResolvedValue(mockData);

    const result = await controller.getAllStores(paginated);
    expect(result).toEqual(expect.objectContaining({ stores: expect.any(Array) }));
  });

  it('should get one store by id', async () => {
    const storeId = 'uuid-123';
    const mockStore = {
      stores: [{ storeId, storeName: 'Loja Exemplo' }],
      total: 1,
      offset: 0,
      limit: 1,
    };

    mockService.findOne.mockResolvedValue(mockStore);

    const result = await controller.findOne(storeId);
    expect(result.stores[0].storeId).toEqual(storeId);
    expect(service.findOne).toHaveBeenCalledWith(storeId);
  });

  it('should list stores by UF', async () => {
    const uf = 'SP';
    const paginated = { offset: 0, limit: 10 } as any;
    const expected = {
      stores: [{ storeId: '1', storeName: 'Loja SP' }],
      total: 1,
      offset: 0,
      limit: 10,
    };

    mockService.findByUf.mockResolvedValue(expected);

    const result = await controller.findByUf(uf, paginated);
    expect(result).toEqual(expected);
    expect(service.findByUf).toHaveBeenCalledWith(uf, paginated);
  });

  it('should update a store', async () => {
    const storeId = 'uuid-123';
    const dto: UpdateStoreDto = { storeName: 'Atualizada' } as any;
    const updated = { storeId, ...dto };

    mockService.update.mockResolvedValue(updated);

    const result = await controller.update(storeId, dto);
    expect(result!.storeName).toBe('Atualizada');
  });

  it('should delete a store', async () => {
    const storeId = 'uuid-123';
    mockService.remove.mockResolvedValue(undefined);

    await expect(controller.remove(storeId)).resolves.toBeUndefined();
    expect(service.remove).toHaveBeenCalledWith(storeId);
  });

  it('should return shipping options by postal code', async () => {
    const postalCode = '12345678';
    const query = { offset: 0, limit: 10 } as PaginatedStoreWithFreteResponse;

    const mockResponse = {
      stores: [],
      pins: [],
      offset: 0,
      limit: 10,
      total: 0,
    };

    mockService.findFreteOptions.mockResolvedValue(mockResponse);

    const result = await controller.findFreteOptions(postalCode, query);
    expect(result).toEqual(mockResponse);
    expect(service.findFreteOptions).toHaveBeenCalledWith(postalCode, query);
  });

  it('should throw ConflictException if store already exists', async () => {
    const dto = { storeName: 'Duplicada' } as any;
    mockService.create.mockRejectedValue(new ConflictException('Store already exists'));

    await expect(controller.create(dto)).rejects.toThrow(ConflictException);
  });
});
