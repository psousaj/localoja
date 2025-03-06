import { Router } from "express";
import placeRouter from "./placeRouter";

const apiRouter = Router()

apiRouter.use('', placeRouter)

export default apiRouter