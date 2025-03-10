import { ErrorCodes, GeoLocationResponse, GeolocationResponseResult } from "../types";
import { env } from "../config/env";
import axios from "axios";
import { BadRequestError, InternalServerError } from "../utils/errors";
import { logger } from "../config/logger";

export class GeolocationAPI {
    /**
     * * REFERENCES
     * * https://developers.google.com/maps/documentation/geocoding/requests-geocoding?hl=pt-br#geocoding-lookup
     * * https://stackoverflow.com/questions/65041545/how-can-i-use-longitude-and-latitude-with-typeorm-and-postgres
     **/

    static async getGeoLocationByAddress(address: string): Promise<GeolocationResponseResult[] | null> {
        try {
            const response = await axios.get<GeoLocationResponse>(`https://maps.googleapis.com/maps/api/geocode/json`, {
                params: {
                    address,
                    key: env.GMAPS_GEOCODING_APIKEY,
                },
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
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

    static async getPlaceByCep(cep: string) {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`, {
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        })

        return response.data
    }
}
