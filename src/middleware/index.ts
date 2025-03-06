import express, { Application } from 'express'
import rateLimit from 'express-rate-limit'
import { DataSource } from 'typeorm'
import cors from 'cors'
import { AppCache } from 'src/cache'

export default function configureApp(app: Application, db: DataSource) {
    //  Rate Limiting
    const limiter = rateLimit({
        windowMs: 5 * 60 * 1000, // 5 minutes
        max: 25,
        message: 'Muitas requisições deste IP, tente novamente mais tarde'
    })
    const cache = new AppCache({ maxKeys: 10 })

    app.set('cache', cache)
    global.cache = cache

    app.disable('x-powered-by') // Disable x-powered-by header for security reasons
    app.use(cors())
    app.use(express.json({ limit: '2mb' })) // Limits json payloads on max 2MB
    app.use(limiter)

    // Health Check
    app.get('/health', (req, res) => {
        res.status(200).json({ status: 'ok', uptime: process.uptime() });
    });

}