// import { ISession } from 'connect-typeorm'
import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm'

@Entity()
// export class Session implements ISession {
export class Session {
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