import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should create a product', async () => {
    const dto: CreateProductDto = { name: 'Produto A', price: 20 } as any;
    const created = { id: 1, ...dto };

    mockService.create.mockResolvedValue(created);

    const result = await controller.create(dto);
    expect(result).toEqual(created);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return paginated product list', async () => {
    const query = {
      name: 'Produto',
      limit: 10,
      offset: 0,
    };

    const paginated = {
      data: [{ id: 1, name: 'Produto', price: 10 }],
      total: 1,
      limit: 10,
      offset: 0,
    };

    mockService.findAll.mockResolvedValue(paginated);

    const result = await controller.findAll(query);
    expect(result).toEqual(paginated);
    expect(service.findAll).toHaveBeenCalledWith(query);
  });

  it('should return one product by id', async () => {
    const product = {
      products: [{ id: 1, name: 'Produto' }],
      total: 1,
      limit: 100,
      offset: 1,
    };

    mockService.findOne.mockResolvedValue(product);

    const result = await controller.findOne('1');
    expect(result).toEqual(product);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if product not found', async () => {
    mockService.findOne.mockRejectedValue(new NotFoundException());

    await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
  });

  it('should update a product', async () => {
    const dto: UpdateProductDto = { name: 'Atualizado' } as any;
    const resultMock = { affected: 1 };

    mockService.update.mockResolvedValue(resultMock);

    const result = await controller.update('1', dto);
    expect(result).toEqual(resultMock);
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should delete a product', async () => {
    const resultMock = { affected: 1 };

    mockService.remove.mockResolvedValue(resultMock);

    const result = await controller.remove('1');
    expect(result).toEqual(resultMock);
    expect(service.remove).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException on remove if product not found', async () => {
    mockService.remove.mockRejectedValue(new NotFoundException());

    await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
  });
});
