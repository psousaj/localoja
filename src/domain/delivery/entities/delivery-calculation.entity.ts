import { StoreType } from "src/types";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class DeliveryCalculation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    cep: string;

    @Column()
    deliveryType: StoreType;

    @Column({ type: 'double precision' })
    distanceInKm: number;

    @Column()
    estimatedTimeInDays: number;

    @Column()
    price: string;

    @Column()
    description: string;

    @Column({ type: 'timestamp' })
    expiresAt: Date;

    @Column()
    storeID: string;

    constructor(partial?: Partial<DeliveryCalculation>) {
        if (partial) {
            Object.assign(this, partial);
        }
        // Garante que o expiresAt só será setado se ainda não tiver sido passado
        if (!this.expiresAt) {
            this.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // +24h
        }
    }
}
