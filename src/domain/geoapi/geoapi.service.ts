import { Injectable } from "@nestjs/common"
import { GmapsService } from "./gmaps/gmaps.service"
import { ViaCepService } from "./via-cep/via-cep.service"
import { MelhorEnvioService } from "./melhorEnvio/melhorEnvio.service"
import { CreateStoreDto } from "../store/dto/create-store.dto"
import { Coordinates, RouteDistance } from "src/types"

@Injectable()
export class GeoApiService {
    constructor(
        private readonly gmaps: GmapsService,
        private readonly viaCep: ViaCepService,
        private readonly melhorEnvio: MelhorEnvioService,
    ) { }

    async getAddressDetailsByPostalCode(postalCode: string) { return this.viaCep.lookup(postalCode) }

    async getCoordinatesByStore(store: CreateStoreDto): Promise<number[]> {
        const { country, address1, city, state, postalCode } = store
        const fullAddress = `${address1}, ${city} - ${state}, ${postalCode}, ${country}`
        return await this.gmaps.getGeoLocationByAddress(fullAddress)
    }

    async getDistance(origins: Coordinates, destinations: Coordinates): Promise<RouteDistance> {
        const result = await this.gmaps.calculateDistance(origins, destinations)
        return result
    }

    // async getShippingOptions(payload) { return this.melhorEnvio.getFrete(payload) }
}
