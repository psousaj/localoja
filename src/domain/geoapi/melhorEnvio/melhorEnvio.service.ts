import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { EnvService } from '../../../config/env/env.service';
import { ProductService } from '../../../domain/product/product.service';
import { FreteOption } from '../../../types';

@Injectable()
export class MelhorEnvioService {
    private readonly token: string;
    private readonly baseUrl: string;

    constructor(
        private readonly httpService: HttpService,
        @Inject() private readonly env: EnvService,
        @Inject() private readonly productService: ProductService,
    ) {
        this.token = this.env.get('MELHORENVIO_TOKEN');
        this.baseUrl = this.env.get('MELHORENVIO_URL');
    }

    async getFreteOptions(fromCep: string, toCep: string, productId: number): Promise<FreteOption[]> {
        const headers = this.buildHeaders();
        const productData = await this.productService.findOne(productId);

        const products = productData.products?.map(p => ({
            id: p.sku,
            width: p.shippingDetails?.width ?? 15,
            height: p.shippingDetails?.height ?? 10,
            length: p.shippingDetails?.length ?? 20,
            weight: p.shippingDetails?.weight ?? 1,
            quantity: 1,
        })) ?? [];

        const payload = {
            from: { postal_code: fromCep },
            to: { postal_code: toCep },
            products,
            options: {
                receipt: false,
                own_hand: false,
                insurance_value: false,
                reverse: false,
                non_commercial: false,
            },
            services: '1,2', // PAC and SEDEX
        };

        const { data } = await this.httpService.axiosRef.post<FreteOption[]>(
            `${this.baseUrl}/api/v2/me/shipment/calculate`,
            payload,
            { headers },
        );

        return data;
    }

    private buildHeaders() {
        return {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${this.token}`,
            'User-Agent': 'Localoja v2.0',
        };
    }
}
