import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

type ProductShippingDetails = {
    width: number,
    height: number,
    length: number,
    weight: number,
}

@Entity()
export class Product {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ length: 255, unique: true })
    name: string;

    @Column({ length: 255, nullable: true })
    description: string;

    @Column()
    price: number;

    @Column({ default: 0 })
    stock: number; // The number of items available for sale (could be a different service)

    @Column({ length: 10, nullable: true, generatedType: 'STORED', asExpression: `'PRD' || "id"` })
    sku: string; // Stock Keeping Unit, a unique identifier for each product

    @Column({
        type: 'json',
        nullable: true,
        default: {
            width: 15,
            height: 10,
            length: 20,
            weight: 1,
        },
    })
    shippingDetails: ProductShippingDetails;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
