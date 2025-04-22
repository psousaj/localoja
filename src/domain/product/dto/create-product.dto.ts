import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class ProductShippingDetailsDto {
    @ApiPropertyOptional({ description: 'Largura do produto em centímetros', example: 15 })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    width: number;

    @ApiPropertyOptional({ description: 'Altura do produto em centímetros', example: 10 })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    height: number;

    @ApiPropertyOptional({ description: 'Comprimento do produto em centímetros', example: 20 })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    length: number;

    @ApiPropertyOptional({ description: 'Peso do produto em gramas', example: 500 })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    weight: number;
}


export class CreateProductDto {
    @ApiProperty({
        description: 'Nome do produto',
        minLength: 4,
        example: 'Camiseta Localoja',
    })
    @IsString()
    @MinLength(4)
    name: string;

    @ApiProperty({
        description: 'Preço do produto em reais (R$)',
        minimum: 0,
        example: 49.90,
    })
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    price: number;

    @ApiPropertyOptional({
        description: 'Descrição detalhada do produto',
        example: 'Camiseta de algodão 100% com estampa local.',
    })
    @IsOptional()
    @IsString()
    description: string;

    @ApiPropertyOptional({
        description: 'Quantidade em estoque',
        minimum: 0,
        example: 100,
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    stock: number;

    @ApiPropertyOptional({
        description: 'Detalhes para envio (dimensões e peso)',
        type: ProductShippingDetailsDto,
    })
    @IsOptional()
    @Type(() => ProductShippingDetailsDto)
    shippingDetails: ProductShippingDetailsDto;
}