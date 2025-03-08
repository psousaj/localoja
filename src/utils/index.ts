import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { BadRequestError } from "./errors";
import { ErrorCodes } from "../types";

const wrapAction = (action: (req: Request, res?: Response, next?: NextFunction) => Promise<any>) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // const { statusCode, body } = await action(req, res)
            // res.status(statusCode).json(body)
            await action(req, res, next)
        } catch (error) {
            next(error)
        }
    }

const validateSchema = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = schema.safeParse(req.body)

        if (!result.success) {
            throw new BadRequestError(ErrorCodes.VALIDATION, "Invalid request body", result)
        }
    } catch (error) {
        next(error)
    }
}


export {
    wrapAction
}
