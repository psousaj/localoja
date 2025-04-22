import { Store } from "src/domain/store/entities/store.entity"
import { StoreType } from "src/types"
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Delivery {
    @PrimaryGeneratedColumn('uuid')
    id: string


    @Column({ type: 'enum', enum: StoreType })
    deliveryType: StoreType

    @Column()
    destinationPostalCode: string

    @Column()
    distanceInKm: number

    @Column()
    deliveryPrice: string

    @Column({ nullable: true })
    description: string

    @Column()
    estimatedTimeInDays: number

    @CreateDateColumn()
    createdAt: Date

    @Column()
    storeID: string

    @OneToMany(() => Store, (store) => store.deliveries, { onDelete: 'CASCADE' })
    store: Store
}
