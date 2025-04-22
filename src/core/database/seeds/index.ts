import { DataSource, DataSourceOptions } from "typeorm";
import { runSeeders, SeederOptions } from "typeorm-extension";
import * as path from "node:path";
import { DeliveryConfigurationFactory } from "./factories/deliveryConfig.factory";
import { ProductFactory } from "./factories/product.factory";
import { StoreFactory } from "./factories/strore.factory";
import MainSeeder from "./main.seeder";
import { env } from "node:process";

const pgOptions = {
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
    entities: [path.join(__dirname, '../../../domain/**/entities/*.entity{.ts,.js}')],
    subscribers: [],
    migrations: [],
}

const options: DataSourceOptions & SeederOptions = {
    ...(pgOptions as DataSourceOptions),
    factories: [DeliveryConfigurationFactory, ProductFactory, StoreFactory],
    seeds: [MainSeeder],
}

const dataSource = new DataSource(options)
dataSource.initialize().then(async () => {
    await runSeeders(dataSource);
    process.exit(0);
})