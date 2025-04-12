import { z } from 'zod'

const envSchema = z.object({
    PGHOST: z.string({ message: "Provides PGHOST env. *hint: check .env file for set" }),
    PGDATABASE: z.string({ message: "Provides PGDATABASE env. *hint: check .env file for set" }),
    PGUSER: z.string({ message: "Provides PGUSER env. *hint: check .env file for set" }),
    PGPASSWORD: z.string({ message: "Provides PGPASSWORD env. *hint: check .env file for set" }),
    SESSION_SECRET: z.string().min(32, "SESSION_SECRET should have at least 32 characters"),
    GMAPS_GEOCODING_APIKEY: z.string({ message: "Provides GMAPS_GEOCODING_APIKEY env. *hint: check .env file for set" }),
    PORT: z.coerce.number().default(3003),
    HOST: z.string().default('0.0.0.0'),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
})

type Env = z.infer<typeof envSchema>

export {
    Env,
    envSchema
}