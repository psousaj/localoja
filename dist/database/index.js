"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const node_path_1 = __importDefault(require("node:path"));
const node_process_1 = require("node:process");
const typeorm_1 = require("typeorm");
const AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: node_process_1.env.PGHOST,
    port: 5432,
    username: node_process_1.env.PGUSER,
    password: node_process_1.env.PGPASSWORD,
    database: node_process_1.env.PGDATABASE,
    synchronize: true, //disable on production
    // logging: true,
    // logger: typeormLogger,
    // logNotifications: true,
    ssl: true,
    entities: [node_path_1.default.join(__dirname, '/entities/*.entity{.ts,.js}')],
    subscribers: [],
    migrations: [],
});
exports.AppDataSource = AppDataSource;
//# sourceMappingURL=index.js.map