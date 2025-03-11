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

const validateBodySchema = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
        throw new BadRequestError(ErrorCodes.VALIDATION, "Invalid request body", result)
    }
    req.body = result.data
    next()
}

const validateParamsSchema = (schema: ZodSchema) =>
    (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.params)

        if (!result.success) {
            throw new BadRequestError(ErrorCodes.VALIDATION, "Invalid request parameters", result);
        }

        req.params = result.data
        next()
    }

export {
    wrapAction,
    validateBodySchema,
    validateParamsSchema
}
