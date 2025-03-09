import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { BadRequestError } from "./errors";
import { ErrorCodes } from "../types";
import { logger } from "../config/logger";

const wrapAction = (action: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.debug(`${action.name} called with ${req.body}`)
        await action(req, res, next)
    } catch (error) {
        next(error)
    }
}

const validateSchema = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    logger.debug(`Validating schema ${schema._def.description} with ${req.body}`)
    if (!result.success) {
        throw new BadRequestError(ErrorCodes.VALIDATION, "Invalid request body", result)
    }
    next()
}


export {
    wrapAction,
    validateSchema
}
