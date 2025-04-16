import { StoreType } from "src/types"
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString } from "class-validator";

export class CreateStoreDto {

    @IsOptional()
    storeId: string

    @IsString()
    storeName: string

    @IsBoolean()
    @IsOptional()
    takeOutInStore: boolean

    @IsInt()
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
    telephoneNumber: string

    @IsString()
    emailAddress: string

    @IsEnum(() => StoreType)
    @IsOptional()
    @IsString()
    type: StoreType

}