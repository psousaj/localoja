import { Logger } from "typeorm";
import { logger as winstonLogger } from '../utils/logger'

export const typeormLogger: Logger = {
    log: (level: "log" | "info" | "warn", message: any) => {
        winstonLogger.info(`[${level}] ${message}`);
    },
    logQuery: (query: string, parameters?: any[]) => {
        winstonLogger.info(`[QUERY] ${query}`, parameters);
    },
    logQueryError: (error: string, query: string, parameters?: any[]) => {
        winstonLogger.error(`[QUERY ERROR] ${error}`, query, parameters);
    },
    logQuerySlow: (time: number, query: string, parameters?: any[]) => {
        winstonLogger.warn(`[QUERY SLOW] ${time}ms`, query, parameters);
    },
    logSchemaBuild: (message: string) => {
        winstonLogger.info(`[SCHEMA BUILD] ${message}`);
    },
    logMigration: (message: string) => {
        winstonLogger.info(`[MIGRATION] ${message}`);
    },
};