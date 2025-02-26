"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const env_1 = require("./env");
const logger = winston_1.default.createLogger({
    format: winston_1.default.format.errors({ stack: true }),
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.errors({ stack: true }), winston_1.default.format.colorize(), winston_1.default.format.splat(), winston_1.default.format.timestamp({
                format: 'DD-MM-YYYY HH:mm:ss [[' + global.process.pid + ']]',
            }), winston_1.default.format.align(), winston_1.default.format.printf((info) => {
                if (info.stack) {
                    return `${info.timestamp} ${info.level} ${info.stack}`;
                }
                return `${info.timestamp} ${info.level} ${String(info.message).trim()}`;
            })),
            level: env_1.env.NODE_ENV !== 'production' ? 'debug' : 'info'
        })
    ]
});
exports.logger = logger;
//# sourceMappingURL=logger.js.map