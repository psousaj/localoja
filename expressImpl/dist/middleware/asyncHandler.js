"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function asyncHandler(fn) {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        }
        catch (error) {
            next(error);
        }
    };
}
exports.default = asyncHandler;
//# sourceMappingURL=asyncHandler.js.map