import { Column, Entity, Index, Point, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"
import { PlaceType } from "../../types"

@Entity('place')
export class Place {

    @PrimaryGeneratedColumn('uuid')
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

    @Column({ nullable: false, type: 'enum', enum: PlaceType })
    placeType: PlaceType

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