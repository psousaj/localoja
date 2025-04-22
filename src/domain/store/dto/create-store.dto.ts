import { StoreType } from '../../../types';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStoreDto {

    @ApiPropertyOptional({ description: 'ID da loja (opcional para criação)' })
    @IsOptional()
    storeId?: string;

    @ApiProperty({ description: 'Nome da loja' })
    @IsString()
    storeName: string;

    @ApiPropertyOptional({ description: 'Indica se a loja permite retirada local' })
    @IsBoolean()
    @IsOptional()
    takeOutInStore?: boolean;

    @ApiPropertyOptional({ description: 'Tempo de preparo da loja em dias' })
    @IsInt()
    @IsOptional()
    shippingTimeInDays?: number;

    @ApiPropertyOptional({ description: 'Latitude da loja' })
    @IsString()
    @IsOptional()
    latitude?: string;

    @ApiPropertyOptional({ description: 'Longitude da loja' })
    @IsString()
    @IsOptional()
    longitude?: string;

    @ApiProperty({ description: 'Endereço principal (rua, avenida etc)' })
    @IsString()
    address1: string;

    @ApiPropertyOptional({ description: 'Complemento do endereço' })
    @IsString()
    @IsOptional()
    address2?: string;

    @ApiPropertyOptional({ description: 'Bairro ou referência adicional' })
    @IsString()
    @IsOptional()
    address3?: string;

    @ApiProperty({ description: 'Cidade da loja' })
    @IsString()
    city: string;

    @ApiProperty({ description: 'Estado (UF)' })
    @IsString()
    state: string;

    @ApiProperty({ description: 'País da loja' })
    @IsString()
    country: string;

    @ApiProperty({
        description: 'CEP no formato 63000000 ou 63000-000',
        example: '63010020'
    })
    @IsString()
    @Transform(({ value }) => value.replace(/\D/g, '')) // remove tudo que não for número
    @Matches(/^[0-9]{8}$/, {
        message: 'CEP must be in the format 63000000 or 63000-000'
    })
    postalCode: string;

    @ApiPropertyOptional({ description: 'Telefone da loja' })
    @IsString()
    @IsOptional()
    telephoneNumber?: string;

    @ApiPropertyOptional({ description: 'Email da loja' })
    @IsString()
    @IsOptional()
    emailAddress?: string;

    @ApiPropertyOptional({
        description: 'Tipo da loja (PDV ou LOJA)',
        enum: StoreType,
        enumName: 'StoreType'
    })
    @IsEnum(() => StoreType)
    @IsOptional()
    @IsString()
    type?: StoreType;
}