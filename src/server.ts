import express from 'express'
import { env } from './utils/env'
import { AppDataSource } from './database'
import { logger } from './utils/logger'
import configureApp from './middleware'

const app = express()

async function startServer() {
    try {
        const db = await AppDataSource.initialize()
        logger.info("📦 Banco de dados conectado!")

        // Chama a função para configurar o app
        configureApp(app, db)

        app.listen(env.PORT, env.HOST, () => {
            logger.info(`🚀 Servidor rodando em http://${env.HOST}:${env.PORT}`)
        })

    } catch (error) {
        logger.error("❌ Erro ao conectar no banco de dados:", error)
        process.exit(1)
    }
}

startServer()
