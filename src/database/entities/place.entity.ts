import { randomUUID } from "node:crypto";
import { BeforeInsert, Column, Entity, PrimaryColumn } from "typeorm";

@Entity('place')
export class Place {

    @PrimaryColumn("uuid")
    id: string;

    @Column({ unique: false })
    cep: string;

    @BeforeInsert()
    generateId() {
        this.id = randomUUID()
    }
}