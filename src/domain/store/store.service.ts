import { Inject, Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { DeliveryService } from '../delivery/delivery.service';
import { PaginationDto } from '../dto/pagination.dto';
import { StoreResponseDto } from './dto/store-response.dto';
import { RepoTags } from 'src/types';

@Injectable()
export class StoreService {

  constructor(
    @Inject(RepoTags.STORE)
    private readonly storeRepository: Repository<Store>,
    @Inject()
    private readonly deliveryService: DeliveryService
  ) {
    this.storeRepository = storeRepository;
  }

  async create(createStoreDto: CreateStoreDto) {
    const createdStore = this.storeRepository.create(createStoreDto);
    await this.storeRepository.save({
      ...createdStore,
      deliveryConfigurations: await this.deliveryService.createDefaultDeliveryConfigs(createdStore.storeId)
    });

    return createdStore;
  }

  async findAll(pagination: PaginationDto): Promise<StoreResponseDto> {
    const { offset = 0, limit = 10 } = pagination;

    const [data, total] = await this.storeRepository.findAndCount({
      skip: offset,
      take: limit,
    });

    return {
      stores: data,
      total,
      offset,
      limit
    }
  }

  async findOne(storeId: string) {
    return await this.storeRepository.findOne({ where: { storeId } });
  }

  async findByUf(uf: string) {
    return await this.storeRepository.find({ where: { state: uf } });
  }

  async update(storeId: string, updateStoreDto: UpdateStoreDto) {
    return await this.storeRepository.update(storeId, updateStoreDto).then(() => {
      return this.storeRepository.findOne({ where: { storeId } });
    });
  }

  async remove(storeId: string) {
    await this.storeRepository.delete(storeId)
  }
}
