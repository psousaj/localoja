import { NextFunction, Request, Response } from "express";

const wrapAction = (action: (req: Request, res?: Response, next?: NextFunction) => any) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // const { statusCode, body } = await action(req, res)
            // res.status(statusCode).json(body)
            await action(req, res, next)
        } catch (error) {
            next(error)
        }
    };

export {
    wrapAction
}
