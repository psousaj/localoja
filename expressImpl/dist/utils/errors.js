"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatZodErrors = exports.normalizeError = exports.ConflictError = exports.UnauthorizedError = exports.NotFoundError = exports.InternalServerError = exports.ForbiddenError = exports.BadRequestError = void 0;
const types_1 = require("../types");
const logger_1 = require("../config/logger");
class BaseError extends Error {
    constructor(errorCode, message, zodErrors, { remoteIp } = {}) {
        super(message);
        // Acesso ao statusCode estático da subclasse com type assertion
        this.statusCode = this.constructor.statusCode;
        this.errorCode = errorCode;
        this.zodErrors = zodErrors
            ? typeof zodErrors === "string"
                ? zodErrors
                : formatZodErrors(zodErrors.error)
            : undefined;
        const ipInfo = remoteIp ? ` - IP: ${remoteIp}` : "";
        logger_1.logger.error(`${errorCode} - ${message}${ipInfo}`);
    }
    getBody() {
        const body = {
            errorCode: this.errorCode,
            message: this.message,
        };
        if (this.zodErrors) {
            return {
                ...body,
                invalidFields: this.zodErrors,
            };
        }
        return body;
    }
}
// Subclasses definem seu próprio statusCode estático
class NotFoundError extends BaseError {
    constructor(errorCode = types_1.ErrorCodes.NOT_FOUND, message, zodErrors) {
        super(errorCode, message, zodErrors);
    }
}
exports.NotFoundError = NotFoundError;
NotFoundError.statusCode = types_1.HttpStatus.NOT_FOUND;
class BadRequestError extends BaseError {
    constructor(errorCode = types_1.ErrorCodes.BAD_REQUEST, message, zodErrors) {
        super(errorCode, message, zodErrors);
    }
}
exports.BadRequestError = BadRequestError;
BadRequestError.statusCode = types_1.HttpStatus.BAD_REQUEST;
class InternalServerError extends BaseError {
    constructor(message, internalError) {
        super(types_1.ErrorCodes.INTERNAL_SERVER_ERROR, message ?? "An unexpected error occurred :( try again later");
        if (internalError) {
            logger_1.logger.error(`[SERVER ERROR DESCRIPTION] ${internalError.stack}`);
        }
    }
}
exports.InternalServerError = InternalServerError;
InternalServerError.statusCode = types_1.HttpStatus.INTERNAL_SERVER_ERROR;
class UnauthorizedError extends BaseError {
    constructor(message, zodErrors) {
        super(types_1.ErrorCodes.UNAUTHORIZED, message, zodErrors);
    }
}
exports.UnauthorizedError = UnauthorizedError;
UnauthorizedError.statusCode = types_1.HttpStatus.UNAUTHORIZED;
class ForbiddenError extends BaseError {
    constructor(message) {
        super(types_1.ErrorCodes.FORBIDDEN, message);
    }
}
exports.ForbiddenError = ForbiddenError;
ForbiddenError.statusCode = types_1.HttpStatus.FORBIDDEN;
class ConflictError extends BaseError {
    constructor(message) {
        super(types_1.ErrorCodes.CONFLICT, message);
    }
}
exports.ConflictError = ConflictError;
ConflictError.statusCode = types_1.HttpStatus.CONFLICT;
const normalizeError = (error) => {
    if (error instanceof BaseError) {
        return error;
    }
    return new InternalServerError("An unexpected error occurred :( try again later", error);
};
exports.normalizeError = normalizeError;
const formatZodErrors = (zodError) => {
    return zodError.errors.map(err => `${err.path.join(".")}: ${err.message}`);
};
exports.formatZodErrors = formatZodErrors;
//# sourceMappingURL=errors.js.map