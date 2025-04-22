import { DeliveryConfiguration } from "../../../../domain/delivery/entities/delivery-config.entity";
import { StoreType } from "../../../../types";
import { setSeederFactory } from "typeorm-extension";

export const DeliveryConfigurationFactory = setSeederFactory(
    DeliveryConfiguration,
    (faker) => {
        const deliveryConfig = new DeliveryConfiguration();
        deliveryConfig.extraDeliveryDays = 0
        deliveryConfig.active = true;
        deliveryConfig.deliveryType = faker.helpers.arrayElement([StoreType.LOJA, StoreType.PDV]);
        deliveryConfig.shippingTimeInDays = faker.number.int({ min: 1, max: 10 });
        deliveryConfig.prazoMotoboy = deliveryConfig.deliveryType === StoreType.PDV ? 1 : 0;
        return deliveryConfig;
    })
