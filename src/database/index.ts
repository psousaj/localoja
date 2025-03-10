import "reflect-metadata"
import { DataSource } from "typeorm"
import path from "node:path"
import { env } from "node:process"

const AppDataSource = new DataSource({
    type: "postgres",
    host: env.PGHOST,
    port: 5432,
    username: env.PGUSER,
    password: env.PGPASSWORD,
    database: env.PGDATABASE,
    synchronize: true, //disable on production
    // logging: true,
    // logger: typeormLogger,
    // logNotifications: true,
    ssl: true,
    entities: [path.join(__dirname, '/entities/*.entity{.ts,.js}')],
    subscribers: [],
    migrations: [],
})

const repositoryProviders = {
    place: AppDataSource.getRepository('place')
}

export { AppDataSource, repositoryProviders }
