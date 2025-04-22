import { Injectable, UnprocessableEntityException } from "@nestjs/common"
import { GmapsService } from "./gmaps/gmaps.service"
import { ViaCepService } from "./via-cep/via-cep.service"
import { MelhorEnvioService } from "./melhorEnvio/melhorEnvio.service"
import { CreateStoreDto } from "../store/dto/create-store.dto"
import { Coordinates, RouteDistance, ViaCepAddressDetails } from "src/types"

@Injectable()
export class GeoApiService {
    constructor(
        private readonly gmaps: GmapsService,
        private readonly viaCep: ViaCepService,
        private readonly melhorEnvio: MelhorEnvioService,
    ) { }

    async getAddressDetailsByPostalCode(postalCode: string): Promise<ViaCepAddressDetails & Coordinates> {
        const targetPostalCode = postalCode.replace(/\D/g, '')
        const addressDetails = await this.viaCep.lookup(targetPostalCode)
        if (!addressDetails || addressDetails.erro) {
            throw new UnprocessableEntityException(`Invalid postal code: ${targetPostalCode}${addressDetails?.erro
                ? ' - ' + addressDetails.erro
                : ''
                }`);
        }

        const targetCoordinates = await this.getCoordinatesByViaCepDetails(addressDetails)
        if (!targetCoordinates) {
            throw new UnprocessableEntityException(`Unable to get coordinates for postal code: ${targetPostalCode}`);
        }

        return {
            ...addressDetails,
            ...targetCoordinates
        }
    }

    async getCoordinatesByStore(store: CreateStoreDto): Promise<Coordinates> {
        const { country, address1, city, state, postalCode } = store
        const fullAddress = `${address1}, ${city} - ${state}, ${postalCode}, ${country}`
        return await this.gmaps.getGeoLocationByAddress(fullAddress)
    }

    async getCoordinatesByViaCepDetails(address: ViaCepAddressDetails): Promise<Coordinates> {
        const { bairro, logradouro, cep, uf, localidade } = address
        const fullAddress = `${logradouro}, ${bairro}, ${localidade} - ${uf}, ${cep}, Brasil`
        return await this.gmaps.getGeoLocationByAddress(fullAddress)
    }

    async getRouteDistance(origins: Coordinates, destinations: Coordinates): Promise<RouteDistance> {
        const result = await this.gmaps.calculateDistance(origins, destinations)
        return result
    }

    async getShippingOptions(fromPostalCode: string, toPostalCode: string, productId: number): Promise<any> {
        return await this.melhorEnvio.getFreteOptions(fromPostalCode, toPostalCode, productId)
    }
}
