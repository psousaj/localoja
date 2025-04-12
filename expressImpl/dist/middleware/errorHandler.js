"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../utils/errors");
function errorHandler(err, req, res, next) {
    // https://expressjs.com/en/guide/error-handling.html#the-default-error-handler
    if (res.headersSent) {
        return next(err);
    }
    const error = (0, errors_1.normalizeError)(err);
    const statusCode = error.statusCode;
    const body = error.getBody();
    res.status(statusCode).json(body);
}
exports.default = errorHandler;
//# sourceMappingURL=errorHandler.js.map