import { Column, Entity, Index, Point, PrimaryColumn } from "typeorm";

@Entity('place')
export class Place {

    @PrimaryColumn("uuid")
    id: string

    @Column({ unique: false })
    cep: string

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