import { Expose, Transform, Type } from 'class-transformer';
import { DeliveryConfigurationDto } from '../../../domain/delivery/dto/delivery-config.dto';
import { StoreType } from '../../../types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsArray } from 'class-validator';
import { ShippingOptionDto } from '../../../domain/delivery/dto/shippingOption.dto';

export class StoreDto {
    @ApiProperty({ description: 'ID da loja (UUID)' })
    @Expose()
    storeId: string;

    @ApiProperty({ description: 'Nome da loja' })
    @Expose()
    storeName: string;

    @ApiProperty({ description: 'Indica se permite retirada local' })
    @Expose()
    takeOutInStore: boolean;

    @ApiProperty({ description: 'Tempo de preparo em dias' })
    @Expose()
    shippingTimeInDays: number;

    @ApiProperty({ description: 'Latitude da loja' })
    @Expose()
    latitude: string;

    @ApiProperty({ description: 'Longitude da loja' })
    @Expose()
    longitude: string;

    @ApiProperty({ description: 'Endereço principal (rua, avenida, etc)' })
    @Expose()
    address1: string;

    @ApiProperty({ description: 'Complemento do endereço', required: false })
    @Expose()
    address2: string;

    @ApiProperty({ description: 'Bairro ou outra informação de endereço', required: false })
    @Expose()
    address3: string;

    @ApiProperty({ description: 'Cidade da loja' })
    @Expose()
    city: string;

    @ApiProperty({ description: 'Estado da loja (UF)' })
    @Expose()
    state: string;

    @ApiProperty({ description: 'País da loja' })
    @Expose()
    country: string;

    @ApiProperty({
        description: 'CEP da loja formatado (ex: 63010-020)',
        example: '63010020'
    })
    @Expose()
    @Transform(({ value }) =>
        value.replace(/^(\d{5})(\d{3})$/, "$1-$2")
    )
    postalCode: string;

    @ApiProperty({ description: 'Telefone da loja', required: false })
    @Expose()
    telephoneNumber: string;

    @ApiProperty({ description: 'Email da loja', required: false })
    @Expose()
    emailAddress: string;

    @ApiProperty({
        description: 'Tipo da loja (PDV ou LOJA)',
        enum: StoreType,
        enumName: 'StoreType'
    })
    @Expose()
    type: StoreType;

    @ApiProperty({
        type: [DeliveryConfigurationDto],
        description: 'Configurações de entrega vinculadas à loja'
    })
    @Expose()
    @Type(() => DeliveryConfigurationDto)
    deliveryConfigurations: DeliveryConfigurationDto[];
}

export class StoreWithFreteOptionsDto {
    @ApiProperty({ description: 'Nome da loja' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'Cidade da loja' })
    @IsString()
    city: string;

    @ApiProperty({ description: 'CEP da loja' })
    @IsString()
    postalCode: string;

    @ApiProperty({ description: 'Tipo da loja', enum: StoreType })
    @IsEnum(StoreType)
    type: StoreType;

    @ApiProperty({ description: 'Distância até a loja (ex: "2.5 km")' })
    @IsString()
    distance: string;

    @ApiProperty({ description: 'Opções de frete disponíveis', type: [ShippingOptionDto] })
    @IsArray()
    value: ShippingOptionDto[];
}