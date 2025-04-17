import { StoreType } from "src/types"
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { DeliveryConfigurationDto } from "src/domain/delivery/dto/delivery-config.dto";
import { Expose } from "class-transformer";

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