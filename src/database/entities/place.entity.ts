import { Column, Entity, Index, Point, PrimaryColumn } from "typeorm";
import { PlaceType } from "../../types";

@Entity('place')
export class Place {

    @PrimaryColumn("uuid")
    id: string

    @Column({ unique: true, nullable: false })
    name: string

    @Column({ nullable: false })
    address: string

    @Column({ nullable: false })
    city: string

    @Column({ nullable: false })
    state: string

    @Column({ nullable: false })
    country: string

    @Column({ unique: false })
    cep: string

    @Column({ unique: false })
    lat: string

    @Column({ unique: false })
    lng: string

    @Column({ nullable: false, type: 'enum', enum: PlaceType })
    type: PlaceType

    @Index({ spatial: true })
    @Column({
        unique: true,
        type: 'geometry',
        spatialFeatureType: 'Point',
        srid: 4326,
        nullable: true
    })
    location: Point
}