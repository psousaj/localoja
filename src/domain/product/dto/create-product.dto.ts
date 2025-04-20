import { Type } from 'class-transformer';
import {
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    Min,
    MinLength,
} from 'class-validator';

class ProductShippingDetailsDto {
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    width: number

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    height: number

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    length: number

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    weight: number
}

export class CreateProductDto {
    @IsString()
    @MinLength(4)
    name: string;

    @IsNumber()
    @Min(0)
    @Type(() => Number)
    price: number;

    @IsOptional()
    @IsString()
    description: string;


    @IsOptional()
    @IsNumber()
    @Min(0)
    stock: number;

    @IsOptional()
    @Type(() => ProductShippingDetailsDto)
    shippingDetails: ProductShippingDetailsDto
}
