import { Inject, Injectable } from '@nestjs/common';
import { DeliveryConfigurationService } from './delivery-config.service';
import { Store } from '../store/entities/store.entity';

@Injectable()
export class DeliveryService {

  constructor(
    @Inject()
    private readonly storeConfigService: DeliveryConfigurationService,
  ) { }

  getOrCreateDeliveryConfig(store: Store) {
    return this.storeConfigService.getOrCreateStoreConfig(store);
  }

  createDefaultDeliveryConfigs(store: Store) {
    return this.storeConfigService.createDefaultConfigs(store);
  }

  getDeliveryConfig(store: Store) {
    return this.storeConfigService.getDeliveryConfigs(store);
  }

  findFreteOptions(store: Store) { }

  findAll() {
    return `This action returns all delivery`;
  }

  findOne(id: number) {
    return `This action returns a #${id} delivery`;
  }

  remove(id: number) {
    return `This action removes a #${id} delivery`;
  }
}
