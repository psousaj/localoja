"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("./database");
const middleware_1 = __importDefault(require("./middleware"));
const package_json_1 = __importDefault(require("../package.json"));
const logger_1 = require("./config/logger");
const env_1 = require("./config/env");
const app = (0, express_1.default)();
async function startServer() {
    logger_1.logger.info('db       .d88b.   .o88b.  .d8b.  db       .d88b.     d88b  .d8b.  ');
    logger_1.logger.info('88      .8P  Y8. d8P  Y8 d8\' \`8b 88      .8P  Y8.    \`8P\' d8\' \`8b ');
    logger_1.logger.info('88      88    88 8P      88ooo88 88      88    88     88  88ooo88 ');
    logger_1.logger.info('88      88    88 8b      88~~~88 88      88    88     88  88~~~88 ');
    logger_1.logger.info('88booo. \`8b  d8\' Y8b  d8 88   88 88booo. \`8b  d8\' db. 88  88   88 ');
    logger_1.logger.info('Y88888P  \`Y88P\'   \`Y88P\' YP   YP Y88888P  \`Y88P\'  Y8888P  YP   YP ');
    logger_1.logger.info('');
    logger_1.logger.info(package_json_1.default.name + ' v' + package_json_1.default.version + ' Copyright (C) 2025 Psousaj');
    logger_1.logger.info('Running in: ' + env_1.env.NODE_ENV + ' mode on ' + process.platform);
    logger_1.logger.info('Server Time: ' + new Date());
    try {
        const db = await database_1.AppDataSource.initialize();
        logger_1.logger.info("📦 Banco de dados conectado! 📦");
        (0, middleware_1.default)(app, db);
        app.listen(env_1.env.PORT, env_1.env.HOST, () => {
            logger_1.logger.info(`🚀 Servidor rodando em http://${env_1.env.HOST}:${env_1.env.PORT} 🚀`);
        });
    }
    catch (error) {
        logger_1.logger.error("❌ Erro ao conectar no banco de dados:", error);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=server.js.map