import { ShippingOption, StoreType } from "src/types";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class DeliveryCalculation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    cep: string;

    @Column()
    storeID: string;

    @Column()
    deliveryType: StoreType;

    @Column("jsonb")
    shippingOptions: ShippingOption[];

    @Column({ type: 'timestamp' })
    expiresAt: Date;

    constructor(partial?: Partial<DeliveryCalculation>) {
        if (partial) Object.assign(this, partial);
        if (!this.expiresAt) {
            this.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h
        }
    }
}
