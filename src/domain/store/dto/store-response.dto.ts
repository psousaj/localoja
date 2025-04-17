import { StorePinMap } from "src/types";
import { StoreDto } from "./store.dto";
import { Expose } from "class-transformer";

@Expose()
export class StoreResponseDto {
    @Expose()
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