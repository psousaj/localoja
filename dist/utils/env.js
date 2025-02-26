"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    PGHOST: zod_1.z.string({ message: "Provides PGHOST env. *hint: check .env file for set" }).url(),
    PGDATABASE: zod_1.z.string({ message: "Provides PGDATABASE env. *hint: check .env file for set" }),
    PGUSER: zod_1.z.string({ message: "Provides PGUSER env. *hint: check .env file for set" }),
    PGPASSWORD: zod_1.z.string({ message: "Provides PGPASSWORD env. *hint: check .env file for set" }),
});
exports.env = envSchema.parse(process.env);
