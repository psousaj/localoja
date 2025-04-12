"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParamsSchema = exports.validateBodySchema = exports.wrapAction = void 0;
const errors_1 = require("./errors");
const types_1 = require("../types");
const wrapAction = (action) => async (req, res, next) => {
    try {
        await action(req, res, next);
    }
    catch (error) {
        next(error);
    }
};
exports.wrapAction = wrapAction;
const validateBodySchema = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        throw new errors_1.BadRequestError(types_1.ErrorCodes.VALIDATION, "Invalid request body", result);
    }
    req.body = result.data;
    next();
};
exports.validateBodySchema = validateBodySchema;
const validateParamsSchema = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
        throw new errors_1.BadRequestError(types_1.ErrorCodes.VALIDATION, "Invalid request parameters", result);
    }
    req.params = result.data;
    next();
};
exports.validateParamsSchema = validateParamsSchema;
//# sourceMappingURL=index.js.map