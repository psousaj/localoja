import { StoreType } from "src/types"
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Matches } from "class-validator";
import { DeliveryConfigurationDto } from "src/domain/delivery/dto/delivery-config.dto";
import { Expose, Transform } from "class-transformer";

export class CreateStoreDto {

    @IsOptional()
    storeId: string

    @IsString()
    storeName: string

    @IsBoolean()
    @IsOptional()
    takeOutInStore: boolean

    @IsInt()
    @IsOptional()
    shippingTimeInDays: number

    @IsString()
    @IsOptional()
    latitude: string

    @IsString()
    @IsOptional()
    longitude: string

    @IsString()
    address1: string

    @IsString()
    @IsOptional()
    address2: string

    @IsString()
    @IsOptional()
    address3: string

    @IsString()
    city: string

    @IsString()
    state: string

    @IsString()
    country: string

    @IsString()
    @Transform(({ value }) => value.replace(/\D/g, "")) // remove tudo que não for número
    @Matches(/^[0-9]{8}$/, {
        message: "CEP must be in the format 63000000 or 63000-000"
    })
    postalCode: string

    @IsString()
    @IsOptional()
    telephoneNumber: string

    @IsString()
    @IsOptional()
    emailAddress: string

    @IsEnum(() => StoreType)
    @IsOptional()
    @IsString()
    type: StoreType

}