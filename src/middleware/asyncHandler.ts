import { NextFunction, Request, Response } from "express"

function asyncHandler<T>(fn: (req: Request, res: Response, next: NextFunction) => Promise<T>) {
    return async (req: any, res: any, next: any) => {
        try {
            await fn(req, res, next)
        } catch (error) {
            next(error)
        }
    }
}

export default asyncHandler