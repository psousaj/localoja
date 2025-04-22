import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CacheService } from 'src/core/cache/cache.service';
import { ViaCepAddressDetails } from 'src/types';

@Injectable()
export class ViaCepService {

    constructor(
        private readonly cache: CacheService,
        private readonly axios: HttpService,
    ) { }

    async lookup(postalCode: string): Promise<ViaCepAddressDetails | null> {
        const cacheKey = `cep:${postalCode}`
        const cachedData = this.cache.get<ViaCepAddressDetails>(cacheKey)

        if (cachedData) return cachedData

        try {
            const response = await this.axios.axiosRef.get<ViaCepAddressDetails>(`https://viacep.com.br/ws/${postalCode}/json/`)

            this.cache.set(cacheKey, response.data, 86400)
            return response.data

        } catch (error: any) {
            return null
        }
    }
}
