import winston from "winston"
import { TransformableInfo } from "logform"
import { env } from "./env"

const logger = winston.createLogger({
    format: winston.format.errors({ stack: true }),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.errors({ stack: true }),
                winston.format.colorize(),
                winston.format.splat(),
                winston.format.timestamp({
                    format: 'DD-MM-YYYY HH:mm:ss [[' + global.process.pid + ']]',
                }),
                winston.format.align(),
                winston.format.printf((info: TransformableInfo) => {
                    if (info.stack) {
                        return `${info.timestamp} ${info.level} ${info.stack}`
                    }

                    return `${info.timestamp} ${info.level} ${String(info.message).trim()}`
                })
            ),
            level: env.NODE_ENV !== 'production' ? 'debug' : 'info'
        })
    ]
})

export { logger }