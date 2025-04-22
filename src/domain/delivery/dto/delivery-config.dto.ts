import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Store } from '../../../domain/store/entities/store.entity';
import { StoreType } from '../../../types';

export class DeliveryConfigurationDto {
    @ApiProperty({
        description: 'Tipo de entrega da loja (PDV ou LOJA)',
        enum: StoreType,
        enumName: 'StoreType',
    })
    @Expose()
    deliveryType: StoreType;

    @ApiProperty({
        description: 'Tempo de preparo da loja em dias',
        example: 2,
    })
    @Expose()
    shippingTimeInDays: number;

    @ApiProperty({
        description: 'Dias adicionais definidos pela loja (para Correios ou motoboy)',
        example: 3,
    })
    @Expose()
    extraDeliveryDays: number;

    @ApiProperty({
        description: 'Prazo máximo da entrega por motoboy (quando aplicável)',
        example: 1,
    })
    @Expose()
    prazoMotoboy: number;

    @ApiProperty({
        description: 'Indica se a configuração está ativa',
        example: true,
    })
    @Expose()
    active: boolean;

    @Exclude()
    storeID: string;

    @Exclude()
    store: Store;
}
