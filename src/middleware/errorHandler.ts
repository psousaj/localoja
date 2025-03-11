import { NextFunction, Request, Response } from "express"
import { normalizeError } from "../utils/errors"

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    // https://expressjs.com/en/guide/error-handling.html#the-default-error-handler
    if (res.headersSent) {
        return next(err)
    }

    const error = normalizeError(err)
    const statusCode = error.statusCode
    const body = error.getBody()

    res.status(statusCode).json(body)
}

export default errorHandler