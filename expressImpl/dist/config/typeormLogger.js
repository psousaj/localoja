"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeormLogger = void 0;
const logger_1 = require("../config/logger");
exports.typeormLogger = {
    log: (level, message) => {
        logger_1.logger.info(`[${level}] ${message}`);
    },
    logQuery: (query, parameters) => {
        logger_1.logger.info(`[QUERY] ${query}`, parameters);
    },
    logQueryError: (error, query, parameters) => {
        logger_1.logger.error(`[QUERY ERROR] ${error}`, query, parameters);
    },
    logQuerySlow: (time, query, parameters) => {
        logger_1.logger.warn(`[QUERY SLOW] ${time}ms`, query, parameters);
    },
    logSchemaBuild: (message) => {
        logger_1.logger.info(`[SCHEMA BUILD] ${message}`);
    },
    logMigration: (message) => {
        logger_1.logger.info(`[MIGRATION] ${message}`);
    },
};
//# sourceMappingURL=typeormLogger.js.map