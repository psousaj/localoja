import { DB_TAG } from "src/config/const";
import { DeliveryConfiguration } from "src/domain/delivery/entities/delivery-config.entity";
import { Product } from "src/domain/product/entities/product.entity";
import { Store } from "src/domain/store/entities/store.entity";
import { RepoTags } from "src/types";
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
    handleRepositoryProvider(RepoTags.DELIVERY_CONFIG, DeliveryConfiguration),
    handleRepositoryProvider(RepoTags.PRODUCT, Product),
]