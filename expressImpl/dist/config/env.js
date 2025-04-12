"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    PGHOST: zod_1.z.string({ message: "Provides PGHOST env. *hint: check .env file for set" }),
    PGDATABASE: zod_1.z.string({ message: "Provides PGDATABASE env. *hint: check .env file for set" }),
    PGUSER: zod_1.z.string({ message: "Provides PGUSER env. *hint: check .env file for set" }),
    PGPASSWORD: zod_1.z.string({ message: "Provides PGPASSWORD env. *hint: check .env file for set" }),
    SESSION_SECRET: zod_1.z.string().min(32, "SESSION_SECRET should have at least 32 characters"),
    GMAPS_GEOCODING_APIKEY: zod_1.z.string({ message: "Provides GMAPS_GEOCODING_APIKEY env. *hint: check .env file for set" }),
    PORT: zod_1.z.coerce.number().default(3003),
    HOST: zod_1.z.string().default('0.0.0.0'),
    NODE_ENV: zod_1.z.enum(['development', 'test', 'production']).default('development'),
});
exports.env = envSchema.parse(process.env);
//# sourceMappingURL=env.js.map