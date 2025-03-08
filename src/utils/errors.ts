import { ErrorCodes, HttpStatus } from "../types"
import { logger } from "../config/logger"

class BaseError extends Error {
    /**
     * Reference: https://medium.com/stonetech/minha-experiência-com-error-handling-no-express-188534ae6ff2
     */

    public statusCode: number
    public errorCode: string

    constructor(statusCode: number, errorCode: string, message: string) {
        super(message)

        this.statusCode = statusCode
        this.errorCode = errorCode

        logger.error(`${errorCode} - ${message}`)
    }

    getBody() {
        return {
            errorCode: this.errorCode,
            message: this.message
        }
    }
}

class NotFoundError extends BaseError {
    constructor(errorCode: string = ErrorCodes.NOT_FOUND, message: string) {
        super(HttpStatus.NOT_FOUND, errorCode, message)
    }
}

class BadRequestError extends BaseError {
    constructor(errorCode: string = ErrorCodes.BAD_REQUEST, message: string) {
        super(HttpStatus.BAD_REQUEST, errorCode, message)
    }
}

class InternalServerError extends BaseError {
    constructor(errorCode: string = ErrorCodes.INTERNAL_SERVER_ERROR, message: string) {
        super(HttpStatus.INTERNAL_SERVER_ERROR, errorCode, message)
    }
}

class UnauthorizedError extends BaseError {
    constructor(errorCode: string = ErrorCodes.UNAUTHORIZED, message: string) {
        super(HttpStatus.UNAUTHORIZED, errorCode, message)
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
