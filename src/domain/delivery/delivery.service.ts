import { Inject, Injectable } from '@nestjs/common';
import { DeliveryConfigurationService } from './delivery-config.service';
import { RepoTags } from 'src/types';

@Injectable()
export class DeliveryService {

  constructor(
    @Inject()
    private readonly storeConfigService: DeliveryConfigurationService,
  ) { }

  getOrCreateDeliveryConfig(storeID: string) {
    return this.storeConfigService.getOrCreateStoreConfig(storeID);
  }

  createDefaultDeliveryConfigs(storeID: string) {
    return this.storeConfigService.createDefaultConfigs(storeID);
  }

  getDeliveryConfig(storeID: string) {
    return this.storeConfigService.getDeliveryConfigs(storeID);
  }

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
