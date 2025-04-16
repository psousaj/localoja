import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DB_TAG } from 'src/config/const';
import { RepoTags, StoreType } from 'src/types';
import { DeliveryConfiguration } from './entities/delivery-config.entity';

@Injectable()
export class DeliveryConfigurationService {
    constructor(
        @Inject(RepoTags.DELIVERY_CONFIG)
        private readonly deliveryConfigurationRepository: Repository<DeliveryConfiguration>
    ) { }

    async getDeliveryConfigs(storeID: string): Promise<DeliveryConfiguration[]> {
        const [lojaConfig, pdvConfig] = await Promise.all([
            this.deliveryConfigurationRepository.findOne({
                where: { storeID, deliveryType: StoreType.LOJA },
                relations: ['deliveryType'],
            }),
            this.deliveryConfigurationRepository.findOne({
                where: { storeID, deliveryType: StoreType.PDV },
                relations: ['deliveryType'],
            }),
        ]);

        return [lojaConfig, pdvConfig].filter(Boolean) as DeliveryConfiguration[];
    }

    async createDefaultConfigs(storeID: string): Promise<DeliveryConfiguration[]> {
        const existingConfigs = await this.getDeliveryConfigs(storeID);

        const missingTypes = [StoreType.LOJA, StoreType.PDV].filter(
            type => !existingConfigs.some(cfg => cfg.deliveryType === type)
        );

        if (missingTypes.length === 0) {
            return existingConfigs;
        }

        const newConfigs = missingTypes.map(type =>
            this.deliveryConfigurationRepository.create({ storeID, deliveryType: type })
        );

        const savedConfigs = await this.deliveryConfigurationRepository.save(newConfigs);

        return [...existingConfigs, ...savedConfigs];
    }

    async getOrCreateStoreConfig(storeID: string): Promise<DeliveryConfiguration[]> {
        const configs = await this.getDeliveryConfigs(storeID);

        if (configs.length === 2) {
            return configs;
        }

        return this.createDefaultConfigs(storeID);
    }
}
