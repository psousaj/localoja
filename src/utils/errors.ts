import { ErrorCodes, HttpStatus } from "../types"
import { logger } from "../config/logger"
import { SafeParseReturnType } from "zod"

class BaseError extends Error {
    /**
     * Reference: https://medium.com/stonetech/minha-experiência-com-error-handling-no-express-188534ae6ff2
     */

    public statusCode: number
    public errorCode: string
    public zodErrors?: any

    constructor(statusCode: number, errorCode: string, message: string, zodErrors?: string | SafeParseReturnType<any, any>) {
        super(message)

        this.statusCode = statusCode
        this.errorCode = errorCode
        this.zodErrors = zodErrors
            ? typeof zodErrors === "string"
                ? zodErrors
                : JSON.stringify(zodErrors.error?.format?.() ?? zodErrors)
            : undefined;


        logger.error(`${errorCode} - ${message}`)
    }


    getBody() {
        const body = {
            errorCode: this.errorCode,
            message: this.message,
        }

        // If there are Zod errors, include them in the response body.
        if (this.zodErrors) {
            return {
                ...body,
                invalidFields: this.zodErrors,
            }
        }

        return body
    }
}

class NotFoundError extends BaseError {
    constructor(errorCode: string = ErrorCodes.NOT_FOUND, message: string, zodErrors?: string | SafeParseReturnType<any, any>) {
        super(HttpStatus.NOT_FOUND, errorCode, message, zodErrors)
    }
}

class BadRequestError extends BaseError {
    constructor(errorCode: string = ErrorCodes.BAD_REQUEST, message: string, zodErrors?: string | SafeParseReturnType<any, any>) {
        super(HttpStatus.BAD_REQUEST, errorCode, message, zodErrors)
    }
}

class InternalServerError extends BaseError {
    constructor(errorCode: string = ErrorCodes.INTERNAL_SERVER_ERROR, message: string) {
        super(HttpStatus.INTERNAL_SERVER_ERROR, errorCode, message)
    }
}

class UnauthorizedError extends BaseError {
    constructor(errorCode: string = ErrorCodes.UNAUTHORIZED, message: string, zodErrors?: string | SafeParseReturnType<any, any>) {
        super(HttpStatus.UNAUTHORIZED, errorCode, message, zodErrors)
    }
}

class ForbiddenError extends BaseError {
    constructor(errorCode: string = ErrorCodes.FORBIDDEN, message: string) {
        super(HttpStatus.FORBIDDEN, errorCode, message)
    }
}

const normalizeError = (error: any) => {
    if (error instanceof BaseError) {
        return error
    }

    return new InternalServerError(ErrorCodes.INTERNAL_SERVER_ERROR, error.message)
}

export {
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    NotFoundError,
    UnauthorizedError,
    normalizeError
}
