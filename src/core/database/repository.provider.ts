import { DB_TAG } from "../../config/const";
import { DeliveryCalculation } from "../../domain/delivery/entities/delivery-calculation.entity";
import { DeliveryConfiguration } from "../../domain/delivery/entities/delivery-config.entity";
import { Delivery } from "../../domain/delivery/entities/delivery.entity";
import { Product } from "../../domain/product/entities/product.entity";
import { Store } from "../../domain/store/entities/store.entity";
import { RepoTags } from "../../types";
import { DataSource, EntityTarget, ObjectLiteral } from "typeorm";

export function handleRepositoryProvider(tag: string, entity: EntityTarget<ObjectLiteral>, dbTagToInject: string = DB_TAG) {
    return {
        provide: tag,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(entity),
        inject: [dbTagToInject],
    }
}

export const domainRepositories = [
    handleRepositoryProvider(RepoTags.STORE, Store),
    handleRepositoryProvider(RepoTags.DELIVERY, Delivery),
    handleRepositoryProvider(RepoTags.DELIVERY_CONFIG, DeliveryConfiguration),
    handleRepositoryProvider(RepoTags.DELIVERY_CALCULATION, DeliveryCalculation),
    handleRepositoryProvider(RepoTags.PRODUCT, Product),
]