import { setSeederFactory } from 'typeorm-extension';
import { Store } from '../../../../domain/store/entities/store.entity';
import { StoreType } from '../../../../types';

export const StoreFactory = setSeederFactory(Store, (faker) => {
    const store = new Store();
    store.storeName = faker.company.name();
    store.address1 = faker.location.streetAddress();
    store.city = faker.location.city();
    store.state = faker.location.state({ abbreviated: true });
    store.country = 'Brasil';
    store.postalCode = faker.location.zipCode('#####-###');
    store.type = StoreType.LOJA;
    store.latitude = faker.location.latitude().toString();
    store.longitude = faker.location.longitude().toString();
    store.shippingTimeInDays = 3;
    store.takeOutInStore = true;
    return store;
});
