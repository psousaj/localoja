import { DeliveryConfiguration } from "src/domain/delivery/entities/delivery-config.entity"
import { Delivery } from "src/domain/delivery/entities/delivery.entity"
import { StoreType } from "src/types"
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity('store')
export class Store {

    @PrimaryGeneratedColumn('uuid')
    storeId: string

    @Column({ unique: true })
    storeName: string

    @Column({ default: true })
    takeOutInStore: boolean

    @Column('int', { nullable: true, default: 1 })
    shippingTimeInDays: number //Tempo de preparo 

    @Column({ nullable: true })
    latitude: string

    @Column({ nullable: true })
    longitude: string

    @Column()
    address1: string

    @Column({ nullable: true })
    address2: string

    @Column({ nullable: true })
    address3: string

    @Column()
    city: string

    @Column()
    state: string

    @Column()
    country: string

    @Column()
    postalCode: string

    @Column({ nullable: true })
    telephoneNumber: string

    @Column({ nullable: true })
    emailAddress: string

    @Column({ type: 'enum', enum: StoreType, default: StoreType.LOJA })
    type: StoreType

    @OneToMany(() => DeliveryConfiguration, (deliveryConfig) => deliveryConfig.store, { nullable: true })
    deliveryConfigurations: DeliveryConfiguration[]

    @OneToMany(() => Delivery, (delivery) => delivery.store, { nullable: true })
    deliveries: Delivery[]
}