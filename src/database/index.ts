import "reflect-metadata"
import { DataSource } from "typeorm";
import path from "node:path";
import { env } from "../utils/env";
import { typeormLogger } from "../utils/typeormLogger";

const AppDataSource = new DataSource({
    type: "postgres",
    host: env.PGHOST,
    port: 5432,
    username: env.PGUSER,
    password: env.PGPASSWORD,
    database: env.PGDATABASE,
    synchronize: true, //disable on production
    logging: true,
    logger: typeormLogger,
    logNotifications: true,
    ssl: true,
    entities: [path.join(__dirname, '../models/*.entity{.ts,.js}')],
    subscribers: [],
    migrations: [],
})

export { AppDataSource }
