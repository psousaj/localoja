import { NextFunction, Request, Response } from "express"
import { ZodSchema } from "zod"
import { BadRequestError } from "./errors"
import { ErrorCodes } from "../types"

const wrapAction = (action: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await action(req, res, next)
    } catch (error) {
        next(error)
    }
}

const validateSchema = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
        throw new BadRequestError(ErrorCodes.VALIDATION, "Invalid request body", result)
    }
    req.body = result.data
    next()
}


export {
    wrapAction,
    validateSchema
}
