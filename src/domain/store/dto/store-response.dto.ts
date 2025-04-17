import { StorePinMap } from "src/types";
import { StoreDto } from "./store.dto";
import { Expose, Type } from "class-transformer";

export class StoreResponseDto {
    @Expose()
    @Type(() => StoreDto)
    stores: StoreDto[];
    @Expose()
    limit: number;
    @Expose()
    offset: number;
    @Expose()
    total: number;
}

export class StoreResponseByCepDto {
    @Expose()
    @Type(() => StoreDto)
    stores: StoreDto[];
    @Expose()
    pins: StorePinMap[];
    @Expose()
    limit: number;
    @Expose()
    offset: number;
    @Expose()
    total: number;
}