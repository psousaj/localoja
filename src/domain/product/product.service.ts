import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RepoTags } from 'src/types';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class ProductService {

  constructor(
    @Inject(RepoTags.PRODUCT)
    private readonly productRepository: Repository<Product>,
  ) { }

  create(createProductDto: CreateProductDto) {
    return this.productRepository.save(createProductDto);
  }

  async findAll(options: PaginationDto & Partial<CreateProductDto>) {
    const { limit = 100, offset = 0, ...filters } = options;

    const [data, total] = await this.productRepository.findAndCount({
      where: filters,
      take: limit,
      skip: offset,
    })

    return {
      products: data,
      total,
      offset,
      limit
    }
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return {
      products: [product],
      offset: 1,
      limit: 100,
      total: 1
    }
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.productRepository.update(id, updateProductDto);
  }

  remove(id: number) {
    const product = this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.productRepository.delete(id);
  }
}
