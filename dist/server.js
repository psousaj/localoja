"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const env_1 = require("./utils/env");
const database_1 = require("./database");
const logger_1 = require("./utils/logger");
const middleware_1 = __importDefault(require("./middleware"));
const app = (0, express_1.default)();
async function startServer() {
    try {
        const db = await database_1.AppDataSource.initialize();
        logger_1.logger.info("📦 Banco de dados conectado!");
        // Chama a função para configurar o app
        (0, middleware_1.default)(app, db);
        app.listen(env_1.env.PORT, env_1.env.HOST, () => {
            logger_1.logger.info(`🚀 Servidor rodando em http://${env_1.env.HOST}:${env_1.env.PORT}`);
        });
    }
    catch (error) {
        logger_1.logger.error("❌ Erro ao conectar no banco de dados:", error);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=server.js.map