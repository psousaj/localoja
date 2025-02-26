import { Session } from '../models/session.entity'
import express, { Application } from 'express'
import { TypeormStore } from 'typeorm-store'
import rateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import { DataSource } from 'typeorm'
import { env } from '../utils/env'
import cors from 'cors'

export default function configureApp(app: Application, db: DataSource) {
    // Use typeorm like store
    const sessionRepository = db.getRepository(Session)
    //  Rate Limiting
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: 'Muitas requisições deste IP, tente novamente mais tarde'
    })

    // Disable 'x-powered-by' for security (not expose what server is running from ext)
    app.disable('x-powered-by')
    app.use(cors())
    // Limits json payloads on max 2MB
    app.use(express.json({ limit: '2mb' }))
    app.use(cookieParser())
    app.use(limiter)
    app.use(
        session({
            secret: env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: { maxAge: 1000 * 60 * 60 * 24 },
            store: new TypeormStore({ repository: sessionRepository })
        })
    )

    // Health Check
    app.get('/health', (req, res) => {
        res.status(200).json({ status: 'ok', uptime: process.uptime() });
    });

}