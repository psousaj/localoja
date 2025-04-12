import { PlaceType } from "src/types"
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity('place')
export class Place {

    @PrimaryGeneratedColumn('uuid')
    storeId: string

    @Column({ unique: true, nullable: false })
    storeName: string

    @Column({ default: true })
    takeOutInStore: boolean

    @Column('int', { nullable: false })
    shippingTimeInDays: number

    @Column({ nullable: true })
    latitude: string

    @Column({ nullable: true })
    longitude: string

    @Column({ nullable: false })
    address1: string

    @Column({ nullable: true })
    address2: string

    @Column({ nullable: true })
    address3: string

    @Column({ nullable: false })
    city: string

    @Column({ nullable: false })
    state: string

    @Column({ nullable: false })
    country: string

    @Column({ nullable: false })
    postalCode: string

    @Column({ nullable: true })
    telephoneNumber: string

    @Column({ nullable: true })
    emailAddress: string

    @Column({ nullable: false, type: 'enum', enum: PlaceType })
    type: PlaceType

}