import express, { Application } from 'express'
import rateLimit from 'express-rate-limit'
import { DataSource } from 'typeorm'
import cors from 'cors'

export default function configureApp(app: Application, db: DataSource) {
    //  Rate Limiting
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100,
        message: 'Muitas requisições deste IP, tente novamente mais tarde'
    })

    // Disable 'x-powered-by' for security (not expose what server is running)
    app.disable('x-powered-by')
    app.use(cors())
    // Limits json payloads on max 2MB
    app.use(express.json({ limit: '2mb' }))
    app.use(limiter)

    // Health Check
    app.get('/health', (req, res) => {
        res.status(200).json({ status: 'ok', uptime: process.uptime() });
    });

}