// session.entity.ts
import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';
import { SessionEntity as TypeOrmStoreSession } from 'typeorm-store';

@Entity()
export class SessionEntity implements TypeOrmStoreSession {
    @PrimaryColumn('varchar', { length: 255 })
    id!: string

    @Column()
    userId: string

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', update: false })
    createdAt: Date

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', update: true })
    updatedAt: Date

    @Column('bigint')
    expiredAt!: number

    @Column('text')
    json!: string

    expiresAt: number

    data: string
}