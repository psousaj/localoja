import { Test, TestingModule } from '@nestjs/testing';
import { StoreService } from './store.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { Repository } from 'typeorm';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { RepoTags } from '../../types';

describe('StoreService', () => {
    let service: StoreService;
    let repo: Repository<Store>;

    const mockStoreRepo = {
        findOneBy: jest.fn(),
        save: jest.fn(),
        findAndCount: jest.fn(),
        findOneOrFail: jest.fn(),
        delete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StoreService,
                {
                    provide: RepoTags.STORE,
                    useValue: mockStoreRepo,
                },
            ],
        }).compile();

        service = module.get<StoreService>(StoreService);
        repo = module.get<Repository<Store>>(RepoTags.STORE);
    });

    afterEach(() => jest.clearAllMocks());

    it('should create a new store', async () => {
        const dto: CreateStoreDto = { storeName: 'Loja X', state: 'SP' } as any;

        mockStoreRepo.findOneBy.mockResolvedValue(null);
        mockStoreRepo.save.mockResolvedValue({ ...dto, storeId: 'uuid-123' });

        const result = await service.create(dto);
        expect(result.storeId).toBeDefined();
        expect(repo.save).toHaveBeenCalledWith(dto);
    });

    it('should not allow duplicate stores', async () => {
        const dto: CreateStoreDto = { storeName: 'Loja Existente' } as any;

        mockStoreRepo.findOneBy.mockResolvedValue({ storeName: dto.storeName });

        await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('should return paginated list of stores', async () => {
        const query = { limit: 10, offset: 0 };
        const mockStores = [{ storeId: '1' }];
        mockStoreRepo.findAndCount.mockResolvedValue([mockStores, 1]);

        const result = await service.findAll(query);
        expect(result.total).toBe(1);
        expect(result.stores).toEqual(mockStores);
    });

    it('should return one store by id', async () => {
        const storeId = 'uuid-123';
        const store = { storeId, storeName: 'Loja A' };

        mockStoreRepo.findOneOrFail.mockResolvedValue(store);

        const result = await service.findOne(storeId);
        expect(result!.stores[0]!.storeId).toEqual(storeId);
    });

    it('should return stores by UF', async () => {
        const uf = 'SP';
        const query = { offset: 0, limit: 10 };
        const stores = [{ storeId: '1', state: uf }];

        mockStoreRepo.findAndCount.mockResolvedValue([stores, 1]);

        const result = await service.findByUf(uf, query);
        expect(result.stores[0].state).toEqual('SP');
    });

    it('should update a store', async () => {
        const storeId = 'uuid-123';
        const dto: UpdateStoreDto = { storeName: 'Atualizada' } as any;
        const existing = { storeId, storeName: 'Antiga' };

        mockStoreRepo.findOneBy.mockResolvedValue(existing);
        mockStoreRepo.save.mockResolvedValue({ ...existing, ...dto });

        const result = await service.update(storeId, dto);
        expect(result!.storeName).toBe('Atualizada');
    });

    it('should throw if trying to update nonexistent store', async () => {
        mockStoreRepo.findOneBy.mockResolvedValue(null);

        await expect(service.update('invalido', {} as any)).rejects.toThrow(NotFoundException);
    });

    it('should delete a store', async () => {
        mockStoreRepo.delete.mockResolvedValue({ affected: 1 });

        await expect(service.remove('uuid')).resolves.toBeUndefined();
    });

    it('should throw if deletion fails', async () => {
        mockStoreRepo.delete.mockResolvedValue({ affected: 0 });

        await expect(service.remove('uuid')).rejects.toThrow(NotFoundException);
    });

    it('should return shipping options (mocked)', async () => {
        const postalCode = '12345678';
        const query = { offset: 0, limit: 10 };

        const result = await service.findFreteOptions(postalCode, query);

        expect(result).toEqual({
            stores: [],
            pins: [],
            offset: 0,
            limit: 10,
            total: 0,
        });
    });
});
