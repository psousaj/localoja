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
import { logger } from "../config/logger"

export class GeolocationAPI {
    /**
     * * REFERENCES
     * * https://developers.google.com/maps/documentation/geocoding/requests-geocoding?hl=pt-br#geocoding-lookup
     * * https://developers.google.com/maps/documentation/routes/compute_route_directions?hl=pt-br
     * * https://stackoverflow.com/questions/65041545/how-can-i-use-longitude-and-latitude-with-typeorm-and-postgres
     **/

    static async getGeoLocationByAddress(address: string): Promise<GeolocationResponseResult[] | null> {
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
        logger.debug(`Getting routes from ${JSON.stringify(origin)} to ${JSON.stringify(destination)}`)
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
                    travelMode: "DRIVE", //Especifies the travel mode for the route default is "DRIVE"
                    routingPreference: "TRAFFIC_AWARE", //Calculates routes considering real-time traffic conditions
                    computeAlternativeRoutes: false, //If true, the service will return multiple routes
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

            return response.data.routes[0]

        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                logger.error(error.response.data.error.message)
                throw new InternalServerError(null, error)
            }
            if (error instanceof BadRequestError) {
                throw error
            }

            throw new InternalServerError("Unexpected error", error.message)
        }
    }

    static async getPlaceByCep(cep: string): Promise<ViaCepResponse> {
        const response = await axios.get<ViaCepResponse>(`https://viacep.com.br/ws/${cep}/json/`, {})

        return response.data
    }
}
