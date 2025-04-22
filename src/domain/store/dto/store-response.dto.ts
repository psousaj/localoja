import { ApiProperty } from '@nestjs/swagger';
import { StoreDto } from './store.dto';
import { Expose, Type } from 'class-transformer';

export class StoreResponseDto {
    @ApiProperty({ type: [StoreDto], description: 'Lista de lojas' })
    @Expose()
    @Type(() => StoreDto)
    stores: StoreDto[];

    @ApiProperty({ description: 'Limite de itens por página' })
    @Expose()
    limit: number;

    @ApiProperty({ description: 'Deslocamento da página atual' })
    @Expose()
    offset: number;

    @ApiProperty({ description: 'Total de itens encontrados' })
    @Expose()
    total: number;
}
