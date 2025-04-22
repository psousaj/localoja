import { ApiProperty } from '@nestjs/swagger';

export class StorePinPosition {
    @ApiProperty({ example: -7.2291 })
    lat: number;

    @ApiProperty({ example: -39.3313 })
    lng: number;
}

export class StorePinMapDto {
    @ApiProperty({ type: StorePinPosition })
    position: StorePinPosition;

    @ApiProperty({ example: 'Loja Localoja Juazeiro' })
    title: string;
}
