
import express from 'express'
import { Router, Request, Response } from 'express';
import { env } from './utils/env';

const app = express();

const route = Router()

app.use(express.json())

route.get('/', (req: Request, res: Response) => {
    res.json({ message: 'hello world with Typescript' })
})

app.use(route)


app.listen(env.PORT, env.HOST, () => { console.log('server running on port 3333 🚀') })