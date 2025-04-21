import { Expose, Transform, Type } from 'class-transformer';
import { DeliveryConfigurationDto } from 'src/domain/delivery/dto/delivery-config.dto';
import { StoreType } from 'src/types';

export class StoreDto {
    @Expose()
    storeId: string;

    @Expose()
    storeName: string;

    @Expose()
    takeOutInStore: boolean;

    @Expose()
    shippingTimeInDays: number;

    @Expose()
    latitude: string;

    @Expose()
    longitude: string;

    @Expose()
    address1: string;

    @Expose()
    address2: string;

    @Expose()
    address3: string;

    @Expose()
    city: string;

    @Expose()
    state: string;

    @Expose()
    country: string;

    @Expose()
    @Transform(({ value }) =>
        value.replace(/^(\d{5})(\d{3})$/, "$1-$2")
    )
    postalCode: string;

    @Expose()
    telephoneNumber: string;

    @Expose()
    emailAddress: string;

    @Expose()
    type: StoreType;

    @Expose()
    @Type(() => DeliveryConfigurationDto)
    deliveryConfigurations: DeliveryConfigurationDto[];
}
