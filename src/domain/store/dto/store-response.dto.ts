import { StorePinMap } from "src/types";
import { Store } from "../entities/store.entity";

export class StoreResponseDto {
    stores: Store[];
    limit: number;
    offset: number;
    total: number;
}

export class StoreResponseByCepDto {
    stores: Store[];
    pins: StorePinMap[];
    limit: number;
    offset: number;
    total: number;
}