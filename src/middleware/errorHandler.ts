import { NextFunction, Request, Response } from "express";
import { logger } from "src/config/logger";

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    logger.error(err)

    const status = err.status ?? 500
    res.status(status)

    res.render('error', {
        layout: false,
        error: typeof err, // This is a string representation of the error type
        message: err.message,
    })
}

export default errorHandler