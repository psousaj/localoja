import { NextFunction, Request, Response } from "express"

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

type ViaCepResponse = {
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
}

type PointObject = {
    type: 'Point'
    coordinates: number[]
}

type PlaceLocation = {
    lat: number
    lng: number
}

enum PlaceType {
    STORE = 'store',
    RESTAURANT = 'restaurant',
    SQUARE = 'square',
    PHARMACY = 'pharmacy',
    HOSPITAL = 'hospital',
    SCHOOL = 'scholl',
    GROCERY = 'grocery',
    SUPERMARKET = 'supermarket',
    PUBLIC_PLACE = 'public_place',
    USER_LOCATION = 'user_location',
    NOT_INFORMED = 'not_informed'
}

enum HttpStatus {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500
}

enum ErrorCodes {
    BAD_REQUEST = 'BAD_REQUEST',
    VALIDATION = 'VALIDATION_ERROR',
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',
    NOT_FOUND = 'NOT_FOUND',
    CONFLICT = 'CONFLICT',
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
    PLACE_NOT_FOUND = 'PLACE_NOT_FOUND',
    INVALID_ADDRESS = 'INVALID_ADDRESS',
    INVALID_PLACE_ID = 'INVALID_PLACE_ID',
}

export {
    ICache,
    ICacheValue,
    ICacheProps,
    GeoLocationResponse,
    RoutesResponse,
    ViaCepResponse,
    RouteDistance,
    GeolocationResponseResult,
    PointObject,
    HttpStatus,
    ErrorCodes,
    PlaceType,
    PlaceLocation
}