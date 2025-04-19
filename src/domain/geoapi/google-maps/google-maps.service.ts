import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { EnvService } from 'src/config/env/env.service';
import { CacheService } from 'src/core/cache/cache.service';
import { GeolocationResponseResult, GeoLocationResponse, PlaceLocation, RouteDistance, RoutesResponse } from 'src/types';

@Injectable()
export class GoogleMapsService {
    private static cache: CacheService
    private static env: EnvService

    constructor(
        @Inject()
        private readonly env: EnvService,
        @Inject()
        private readonly cache: CacheService,
    ) { }

    async getGeoLocationByAddress(address: string): Promise<GeolocationResponseResult[] | null> {
        const cacheKey = `geolocation:${address}`
        const cachedData = this.cache.get<GeolocationResponseResult[]>(cacheKey)

        if (cachedData) return cachedData

        try {
            const response = await axios.get<GeoLocationResponse>(`https://maps.googleapis.com/maps/api/geocode/json`, {
                params: {
                    address,
                    key: this.env.get("GMAPS_GEOCODING_APIKEY"),
                },
            })

            if (response.data.error_message) {
                throw new InternalServerErrorException(response.data.error_message)
            }
            if (response.data.status === "ZERO_RESULTS") {
                throw new BadRequestException("No results found")
            }

            this.cache.set(cacheKey, response.data.results, 600)
            return response.data.results

        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                throw new InternalServerErrorException(error.message, error)
            }
            if (error instanceof BadRequestException) {
                throw error
            }

            throw new InternalServerErrorException("Unexpected error", error.message)
        }
    }

    static async getRoutesToPlace(origin: PlaceLocation, destination: PlaceLocation): Promise<RouteDistance> {
        const cacheKey = `routes:${origin.latitude},${origin.longitude}|${destination.latitude},${destination.longitude}`
        const cachedData = this.cache.get<RouteDistance>(cacheKey)

        if (cachedData) return cachedData

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
                        "X-Goog-Api-Key": this.env.get("GMAPS_GEOCODING_APIKEY"),
                        "X-Goog-FieldMask": "routes.duration,routes.distanceMeters"
                    }
                })

            this.cache.set(cacheKey, response.data.routes[0], 600)
            return response.data.routes[0]

        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 502) {
                    throw new InternalServerErrorException("Something went wrong, try again after 30 seconds", error)
                }

                throw new InternalServerErrorException(error.message, error)
            }
            if (error instanceof BadRequestException) {
                throw error
            }

            throw new InternalServerErrorException("Unexpected error", error.message)
        }
    }


}


