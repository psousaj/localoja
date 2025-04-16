import { DataSource } from "typeorm"
import { EnvService } from "src/config/env/env.service";
import * as path from 'path';
import { DB_TAG } from "src/config/const";

export const databaseProviders = [
    {
        // provide: 'DATA_SOURCE', // A unique name for the data source
        provide: DB_TAG,
        useFactory: async (env: EnvService) => {
            const currentNodeEnv = env.get('NODE_ENV')
            const dataSource = new DataSource({
                type: 'postgres',
                host: env.get('PGHOST'),
                username: env.get('PGUSER'),
                password: env.get('PGPASSWORD'),
                database: env.get('PGDATABASE'),
                entities: [path.join(__dirname, '../../domain/**/entities/*.entity{.ts,.js}')],
                synchronize: currentNodeEnv !== 'production', //disable this on production
                ssl: true
            })
            return dataSource.initialize()
        },
        inject: [EnvService],
    }
]