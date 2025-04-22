import { Store } from "../../../domain/store/entities/store.entity";
import { StoreType } from "../../../types";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(["storeID", "deliveryType"])
export class DeliveryConfiguration {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ enum: StoreType })
    deliveryType: StoreType

    @Column({ default: 1 })
    shippingTimeInDays: number //Tempo de preparo da loja

    @Column({ default: 0 })
    extraDeliveryDays: number //Dias adicionais definidos pela loja	

    @Column({ default: 2 })
    prazoMotoboy: number //Prazo máximo de entrega do motoboy

    @Column({ default: true })
    active: boolean

    @Column()
    storeID: string

    @ManyToOne(() => Store, (store) => store.deliveryConfigurations, { onDelete: 'CASCADE' })
    store: Store
}