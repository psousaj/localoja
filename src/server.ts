import express from 'express'
import { AppDataSource } from './database'
import configureApp from './middleware'
import pkg from '../package.json'
import { logger } from './config/logger'
import { env } from './config/env'

const app = express()

async function startServer() {
    logger.info('db       .d88b.   .o88b.  .d8b.  db       .d88b.     d88b  .d8b.  ')
    logger.info('88      .8P  Y8. d8P  Y8 d8\' \`8b 88      .8P  Y8.    \`8P\' d8\' \`8b ')
    logger.info('88      88    88 8P      88ooo88 88      88    88     88  88ooo88 ')
    logger.info('88      88    88 8b      88~~~88 88      88    88     88  88~~~88 ')
    logger.info('88booo. \`8b  d8\' Y8b  d8 88   88 88booo. \`8b  d8\' db. 88  88   88 ')
    logger.info('Y88888P  \`Y88P\'   \`Y88P\' YP   YP Y88888P  \`Y88P\'  Y8888P  YP   YP ')
    logger.info('')
    logger.info(pkg.name + ' v' + pkg.version + ' Copyright (C) 2025 Psousaj')
    logger.info('Running in: ' + env.NODE_ENV + ' mode on ' + process.platform)
    logger.info('Server Time: ' + new Date())

    try {
        const db = await AppDataSource.initialize()
        logger.info("📦 Banco de dados conectado! 📦")

        configureApp(app, db)

        app.listen(env.PORT, env.HOST, () => {
            logger.info(`🚀 Servidor rodando em http://${env.HOST}:${env.PORT} 🚀`)
        })

    } catch (error) {
        logger.error("❌ Erro ao conectar no banco de dados:", error)
        process.exit(1)
    }
}

startServer()
