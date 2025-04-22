import { Store } from "src/domain/store/entities/store.entity"

type ICacheProps = {
    stdTTL?: number // (default: 0) número em segundos pra cada elemento no cache. 0 = ilimitado
    checkPeriod?: number // (default: 600) período em segundos para checar e deletar expired
    maxKeys?: number // (default: 10) // limit for elements maintened in memory
}

type ICacheValue = {
    value: string | object
    ttl?: number
}

interface ICache<K = string, V = ICacheValue> {
    get(key: K): V | null
    set(key: K, value: string | object, ttl?: number): void
    take(key: K): V | null
    del(key: K): void
    ttl(key: K, ttl: number): boolean
    listKeys(): Array<K> | null
    flushAll(): void
}

type GeolocationResponseResult = {
    address_components: Array<{
        long_name: string
        short_name: string
        types: Array<string>
    }>
    formatted_address: string
    geometry: {
        bounds: {
            northeast: {
                lat: number
                lng: number
            }
            southwest: {
                lat: number
                lng: number
            }
        },
        location_type: string,
        location: {
            lat: number
            lng: number
        }
        viewport: {
            northeast: {
                lat: number
                lng: number
            }
            southwest: {
                lat: number
                lng: number
            }
        }
    },
    place_id: string,
    types: Array<string>
}

type GeoLocationResponse = {
    error_message?: string
    results: Array<GeolocationResponseResult>
    status: string
}

type RouteDistance = {
    distanceMeters: number,
    duration: string
}

type RoutesResponse = {
    routes: RouteDistance[]
}

type ViaCepAddressDetails = {
    cep: string,
    logradouro: string,
    complemento: string,
    unidade: string,
    bairro: string,
    localidade: string,
    uf: string,
    estado: string,
    regiao: string,
    ibge: string,
    gia: string,
    ddd: string,
    siafi: string
    erro?: string
}

type StorePinMap = {
    position: {
        lat: string,
        lng: string
    },
    title: string
}

enum StoreType {
    PDV = 'PDV',
    LOJA = 'LOJA',
}

type FreteOption = {
    id: number;
    name: string;
    price: string;
    custom_price: string;
    discount: string;
    currency: string;
    delivery_time: number;
    delivery_range: {
        min: number;
        max: number;
    };
    custom_delivery_time: number;
    custom_delivery_range: {
        min: number;
        max: number;
    };
    packages: {
        price: string;
        discount: string;
        format: string;
        weight: string;
        insurance_value: string;
        products: {
            id: string;
            quantity: number;
        }[];
        dimensions: {
            height: number;
            width: number;
            length: number;
        };
    }[];
    additional_services: {
        receipt: boolean;
        own_hand: boolean;
        collect: boolean;
    };
    additional: {
        unit: {
            price: number;
            delivery: number;
        };
    };
    company: {
        id: number;
        name: string;
        picture: string;
    };
};

type Coordinates = {
    latitude: number | string;
    longitude: number | string;
}

type StoreWithDistanceToCustomer = Store & {
    distance: RouteDistance
};

enum RepoTags {
    STORE = 'STORE',
    DELIVERY = 'DELIVERY',
    DELIVERY_CONFIG = 'DELIVERY_CONFIG',
    DELIVERY_CALCULATION = 'DELIVERY_CALCULATION',
    PRODUCT = 'PRODUCT',
}

export {
    ICache,
    ICacheValue,
    ICacheProps,
    GeoLocationResponse,
    RoutesResponse,
    ViaCepAddressDetails,
    RouteDistance,
    GeolocationResponseResult,
    StoreType,
    StorePinMap,
    RepoTags,
    FreteOption,
    Coordinates,
    StoreWithDistanceToCustomer
}