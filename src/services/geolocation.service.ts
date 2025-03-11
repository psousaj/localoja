import {
    ErrorCodes,
    GeoLocationResponse,
    GeolocationResponseResult,
    PlaceLocation,
    RouteDistance,
    RoutesResponse,
    ViaCepResponse
} from "../types"
import { env } from "../config/env"
import axios from "axios"
import { BadRequestError, InternalServerError } from "../utils/errors"
import { AppCache } from "../cache"

const cache: AppCache = AppCache.getInstance({ maxKeys: 20 })

export class GeolocationAPI {

    static async getGeoLocationByAddress(address: string): Promise<GeolocationResponseResult[] | null> {
        const cacheKey = `geolocation:${address}`
        const cachedData = cache.get(cacheKey)

        if (cachedData) return cachedData.value as GeolocationResponseResult[]

        try {
            const response = await axios.get<GeoLocationResponse>(`https://maps.googleapis.com/maps/api/geocode/json`, {
                params: {
                    address,
                    key: env.GMAPS_GEOCODING_APIKEY,
                },
            })

            if (response.data.error_message) {
                throw new InternalServerError(response.data.error_message)
            }
            if (response.data.status === "ZERO_RESULTS") {
                throw new BadRequestError(ErrorCodes.PLACE_NOT_FOUND, "No results found")
            }

            cache.set(cacheKey, response.data.results, 600)
            return response.data.results

        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                throw new InternalServerError(error.message, error)
            }
            if (error instanceof BadRequestError) {
                throw error
            }

            throw new InternalServerError("Unexpected error", error.message)
        }
    }

    static async getRoutesToPlace(origin: PlaceLocation, destination: PlaceLocation): Promise<RouteDistance> {
        const cacheKey = `routes:${origin.latitude},${origin.longitude}-${destination.latitude},${destination.longitude}`
        const cachedData = cache.get(cacheKey)

        if (cachedData) return cachedData.value as RouteDistance

        try {
            const response = await axios.post<RoutesResponse>(`https://routes.googleapis.com/directions/v2:computeRoutes`,
                {
                    origin: {
                        location: {
                            latLng: {
                                latitude: origin.latitude,
                                longitude: origin.longitude
                            }
                        }
                    },
                    destination: {
                        location: {
                            latLng: {
                                latitude: destination.latitude,
                                longitude: destination.longitude
                            }
                        }
                    },
                    travelMode: "DRIVE",
                    routingPreference: "TRAFFIC_AWARE",
                    computeAlternativeRoutes: false,
                    languageCode: "pt-BR",
                    units: "METRIC"
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-Goog-Api-Key": env.GMAPS_GEOCODING_APIKEY,
                        "X-Goog-FieldMask": "routes.duration,routes.distanceMeters"
                    }
                })

            cache.set(cacheKey, response.data.routes[0], 600)
            return response.data.routes[0]

        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                throw new InternalServerError(null, error)
            }
            if (error instanceof BadRequestError) {
                throw error
            }

            throw new InternalServerError("Unexpected error", error.message)
        }
    }

    static async getPlaceByCep(cep: string): Promise<ViaCepResponse> {
        const cacheKey = `cep:${cep}`
        const cachedData = cache.get(cacheKey)

        if (cachedData) return cachedData.value as ViaCepResponse

        try {
            const response = await axios.get<ViaCepResponse>(`https://viacep.com.br/ws/${cep}/json/`)

            cache.set(cacheKey, response.data, 86400)
            return response.data

        } catch (error: any) {
            throw new InternalServerError("Failed to fetch CEP data", error.message)
        }
    }
}
