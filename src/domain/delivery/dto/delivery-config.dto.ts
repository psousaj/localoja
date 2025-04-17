import { Exclude, Expose } from "class-transformer";
import { Store } from "src/domain/store/entities/store.entity";
import { StoreType } from "src/types";

export class DeliveryConfigurationDto {

    deliveryType: StoreType

    shippingTimeInDays: number //Tempo de preparo da loja

    extraDeliveryDays: number //Dias adicionais definidos pela loja	

    prazoMotoboy: number //Prazo máximo de entrega do motoboy

    active: boolean

    @Exclude()
    storeID: string

    @Exclude()
    store: Store
}