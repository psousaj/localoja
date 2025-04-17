import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DB_TAG } from 'src/config/const';
import { RepoTags, StoreType } from 'src/types';
import { DeliveryConfiguration } from './entities/delivery-config.entity';
import { Store } from '../store/entities/store.entity';

@Injectable()
export class DeliveryConfigurationService {
    constructor(
        @Inject(RepoTags.DELIVERY_CONFIG)
        private readonly deliveryConfigurationRepository: Repository<DeliveryConfiguration>
    ) { }

    async getDeliveryConfigs(store: Store): Promise<DeliveryConfiguration[]> {
        const [lojaConfig, pdvConfig] = await Promise.all([
            this.deliveryConfigurationRepository.findOne({
                where: { store, deliveryType: StoreType.LOJA },
            }),
            this.deliveryConfigurationRepository.findOne({
                where: { store, deliveryType: StoreType.PDV },
            }),
        ]);

        return [lojaConfig, pdvConfig].filter(Boolean) as DeliveryConfiguration[];
    }

    async createDefaultConfigs(store: Store): Promise<DeliveryConfiguration[]> {
        const existingConfigs = await this.getDeliveryConfigs(store);

        const missingTypes = [StoreType.LOJA, StoreType.PDV].filter(
            type => !existingConfigs.some(cfg => cfg.deliveryType === type)
        );

        if (missingTypes.length === 0) {
            return existingConfigs;
        }

        const newConfigs = missingTypes.map(type => ({
            storeID: store.storeId,
            deliveryType: type,
            store
        }));

        const savedConfigs = await this.deliveryConfigurationRepository.save(newConfigs);


        return [...existingConfigs, ...savedConfigs];
    }

    async getOrCreateStoreConfig(store: Store): Promise<DeliveryConfiguration[]> {
        const configs = await this.getDeliveryConfigs(store);

        if (configs.length === 2) {
            return configs;
        }

        return this.createDefaultConfigs(store);
    }
}
