import { GeoLocationResponse, GeolocationResponseResult } from "../types";
import { env } from "../config/env";

export class GeolocationAPI {
    /**
     * * REFERENCES
     * * https://developers.google.com/maps/documentation/geocoding/requests-geocoding?hl=pt-br#geocoding-lookup
     * * https://stackoverflow.com/questions/65041545/how-can-i-use-longitude-and-latitude-with-typeorm-and-postgres
     **/


    static async getGeoLocationByAddress(address: string): Promise<GeolocationResponseResult[] | null> {
        const places: GeoLocationResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${env.GMAPS_GEOCODING_APIKEY}`).then((res) => res.json());
        return places.error_message ? null : places.results
    }

    static async getPlaceByCep(cep: string) {
        const place = await fetch(`https://viacep.com.br/ws/${cep}/json/`).then((res) => res.json());
        return place;
    }
}