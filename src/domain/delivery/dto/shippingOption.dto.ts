import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ShippingOptionDto {
    @ApiProperty({ description: 'Prazo de entrega (ex: "2 dias úteis")' })
    @IsString()
    prazo: string;

    @ApiProperty({ description: 'Preço do frete (ex: "R$ 12,90")' })
    @IsString()
    price: string;

    @ApiProperty({ description: 'Descrição da opção de frete' })
    @IsString()
    description: string;
}
