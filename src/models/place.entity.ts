import { randomUUID } from "node:crypto";
import { BeforeInsert, Entity, PrimaryColumn } from "typeorm";

@Entity()
class Place {

    @PrimaryColumn("uuid")
    id: string;

    @BeforeInsert()
    generateId() {
        this.id = randomUUID()
    }
}