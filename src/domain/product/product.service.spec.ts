import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RepoTags } from '../../types';

describe('ProductService', () => {
  let service: ProductService;
  let repo: Repository<Product>;

  const mockRepo = {
    save: jest.fn(),
    findAndCount: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: RepoTags.PRODUCT,
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repo = module.get<Repository<Product>>(RepoTags.PRODUCT);
  });

  afterEach(() => jest.clearAllMocks());

  it('should create a product', async () => {
    const dto: CreateProductDto = { name: 'Produto A', price: 10 } as any;
    const savedProduct = { id: 1, ...dto };

    mockRepo.save.mockResolvedValue(savedProduct);

    const result = await service.create(dto);
    expect(result).toEqual(savedProduct);
    expect(mockRepo.save).toHaveBeenCalledWith(dto);
  });

  it('should return paginated products with filters', async () => {
    const options = {
      limit: 10,
      offset: 0,
      name: 'Produto',
    };

    const mockData = [{ id: 1, name: 'Produto', price: 10 }];
    mockRepo.findAndCount.mockResolvedValue([mockData, 1]);

    const result = await service.findAll(options);

    expect(result).toEqual({
      data: mockData,
      total: 1,
      limit: 10,
      offset: 0,
    });
    expect(mockRepo.findAndCount).toHaveBeenCalledWith({
      where: { name: 'Produto' },
      take: 10,
      skip: 0,
    });
  });

  it('should return one product by id', async () => {
    const mockProduct = { id: 1, name: 'Produto' };
    mockRepo.findOneBy.mockResolvedValue(mockProduct);

    const result = await service.findOne(1);

    expect(result).toEqual({
      products: [mockProduct],
      offset: 1,
      limit: 100,
      total: 1,
    });
  });

  it('should throw NotFoundException when product not found', async () => {
    mockRepo.findOneBy.mockResolvedValue(null);

    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
  });

  it('should update a product', async () => {
    const dto: UpdateProductDto = { name: 'Atualizado' } as any;

    mockRepo.update.mockResolvedValue({ affected: 1 });

    const result = await service.update(1, dto);

    expect(result).toEqual({ affected: 1 });
    expect(mockRepo.update).toHaveBeenCalledWith(1, dto);
  });

  it('should delete a product', async () => {
    const mockProduct = { id: 1, name: 'Produto' };
    mockRepo.findOneBy.mockResolvedValue(mockProduct);
    mockRepo.delete.mockResolvedValue({ affected: 1 });

    const result = await service.remove(1);
    expect(result).toEqual({ affected: 1 });
  });

});
