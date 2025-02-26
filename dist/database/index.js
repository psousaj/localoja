"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const node_path_1 = __importDefault(require("node:path"));
const env_1 = require("../utils/env");
const typeormLogger_1 = require("../utils/typeormLogger");
const AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: env_1.env.PGHOST,
    port: 5432,
    username: env_1.env.PGUSER,
    password: env_1.env.PGPASSWORD,
    database: env_1.env.PGDATABASE,
    synchronize: true, //disable on production
    logging: true,
    logger: typeormLogger_1.typeormLogger,
    logNotifications: true,
    ssl: true,
    entities: [node_path_1.default.join(__dirname, '../models/*.entity{.ts,.js}')],
    subscribers: [],
    migrations: [],
});
exports.AppDataSource = AppDataSource;
//# sourceMappingURL=index.js.map