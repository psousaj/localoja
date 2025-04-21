import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CacheService } from 'src/core/cache/cache.service';
import { ViaCepResponse } from 'src/types';

@Injectable()
export class ViaCepService {

    constructor(
        private readonly cache: CacheService,
        private readonly axios: HttpService,
    ) { }

    async lookup(postalCode: string): Promise<ViaCepResponse | null> {
        const cacheKey = `cep:${postalCode}`
        const cachedData = this.cache.get<ViaCepResponse>(cacheKey)

        if (cachedData) return cachedData

        try {
            const response = await this.axios.axiosRef.get<ViaCepResponse>(`https://viacep.com.br/ws/${postalCode}/json/`)

            if (response.data.erro) {
                return null
            }

            this.cache.set(cacheKey, response.data, 86400)
            return response.data

        } catch (error: any) {
            throw new InternalServerErrorException("Failed to fetch CEP data", error)
        }
    }
}
