import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { StorePinMapDto } from './store-pinmap.dto';
import { CreateProductDto } from '../product/dto/create-product.dto';
import { StoreResponseDto } from '../store/dto/store-response.dto';
import { StoreDto, StoreWithFreteOptionsDto } from '../store/dto/store.dto';
import { Store } from '../store/entities/store.entity';

export class PaginatedResponse {
    @IsOptional()
    @ApiProperty({ description: 'Total de itens' })
    total?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    @ApiProperty({ description: 'Número da página atual' })
    offset?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @ApiProperty({ description: 'Número de itens por página' })
    limit?: number;
}

export class PaginatedStoreResponse extends PaginatedResponse {
    @ApiProperty({ description: 'Lista de Lojas', type: [StoreDto] })
    @IsOptional()
    @Type(() => Array<StoreDto>)
    stores?: StoreDto[] | Store[];
}

export class PaginatedStoreWithFreteResponse extends PaginatedResponse {
    @ApiProperty({ description: 'Lista de Lojas', type: [StoreWithFreteOptionsDto] })
    @IsOptional()
    @Type(() => Array<StoreWithFreteOptionsDto>)
    stores?: StoreWithFreteOptionsDto[];

    @IsOptional()
    @ApiProperty({ description: 'Array com os pins para o frontend', type: [StorePinMapDto] })
    pins?: StorePinMapDto[];
}

export class PaginatedProductResponse extends PaginatedResponse {
    @ApiProperty({ description: 'Lista de Produtos', type: [CreateProductDto] })
    data?: CreateProductDto[];
}
