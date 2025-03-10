import { ErrorCodes, HttpStatus } from "../types"
import { logger } from "../config/logger"
import { SafeParseReturnType } from "zod"

type BaseErrorConstructor = {
    new(...args: any[]): BaseError
    statusCode: number
}

class BaseError extends Error {
    public statusCode: number
    public errorCode: string
    public zodErrors?: any

    constructor(
        errorCode: string,
        message: string,
        zodErrors?: string | SafeParseReturnType<any, any>,
        { remoteIp }: { remoteIp?: string } = {}
    ) {
        super(message)

        // Acesso ao statusCode estático da subclasse com type assertion
        this.statusCode = (this.constructor as BaseErrorConstructor).statusCode
        this.errorCode = errorCode
        this.zodErrors = zodErrors
            ? typeof zodErrors === "string"
                ? zodErrors
                : zodErrors.error.format()
            : undefined

        const ipInfo = remoteIp ? ` - IP: ${remoteIp}` : ""
        logger.error(`${errorCode} - ${message}${ipInfo}`)
    }

    getBody() {
        const body = {
            errorCode: this.errorCode,
            message: this.message,
        }

        if (this.zodErrors) {
            return {
                ...body,
                invalidFields: this.zodErrors,
            }
        }

        return body
    }
}

// Subclasses definem seu próprio statusCode estático
class NotFoundError extends BaseError {
    static statusCode = HttpStatus.NOT_FOUND
    constructor(errorCode: string = ErrorCodes.NOT_FOUND, message: string, zodErrors?: string | SafeParseReturnType<any, any>) {
        super(errorCode, message, zodErrors)
    }
}

class BadRequestError extends BaseError {
    static statusCode = HttpStatus.BAD_REQUEST
    constructor(errorCode: string = ErrorCodes.BAD_REQUEST, message: string, zodErrors?: string | SafeParseReturnType<any, any>) {
        super(errorCode, message, zodErrors)
    }
}

class InternalServerError extends BaseError {
    static statusCode = HttpStatus.INTERNAL_SERVER_ERROR
    constructor(message: string, internalError?: Error) {
        super(ErrorCodes.INTERNAL_SERVER_ERROR, message)
        if (internalError) {
            logger.error(`[SERVER ERROR DESCRIPTION] ${internalError.stack}`)
        }
    }
}

class UnauthorizedError extends BaseError {
    static statusCode = HttpStatus.UNAUTHORIZED
    constructor(message: string, zodErrors?: string | SafeParseReturnType<any, any>) {
        super(ErrorCodes.UNAUTHORIZED, message, zodErrors)
    }
}

class ForbiddenError extends BaseError {
    static statusCode = HttpStatus.FORBIDDEN
    constructor(message: string) {
        super(ErrorCodes.FORBIDDEN, message)
    }
}

class ConflictError extends BaseError {
    static statusCode = HttpStatus.CONFLICT
    constructor(message: string) {
        super(ErrorCodes.CONFLICT, message)
    }
}

const normalizeError = (error: Error | any) => {
    if (error instanceof BaseError) {
        return error
    }

    return new InternalServerError("An unexpected error occurred :( try again later", error)
}

export {
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    NotFoundError,
    UnauthorizedError,
    ConflictError,
    normalizeError,
}