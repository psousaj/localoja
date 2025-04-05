"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceType = exports.ErrorCodes = exports.HttpStatus = void 0;
var PlaceType;
(function (PlaceType) {
    PlaceType["STORE"] = "store";
    PlaceType["RESTAURANT"] = "restaurant";
    PlaceType["SQUARE"] = "square";
    PlaceType["PHARMACY"] = "pharmacy";
    PlaceType["HOSPITAL"] = "hospital";
    PlaceType["SCHOOL"] = "scholl";
    PlaceType["GROCERY"] = "grocery";
    PlaceType["SUPERMARKET"] = "supermarket";
    PlaceType["PUBLIC_PLACE"] = "public_place";
    PlaceType["USER_LOCATION"] = "user_location";
    PlaceType["NOT_INFORMED"] = "not_informed";
})(PlaceType || (exports.PlaceType = PlaceType = {}));
var HttpStatus;
(function (HttpStatus) {
    HttpStatus[HttpStatus["OK"] = 200] = "OK";
    HttpStatus[HttpStatus["CREATED"] = 201] = "CREATED";
    HttpStatus[HttpStatus["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpStatus[HttpStatus["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HttpStatus[HttpStatus["FORBIDDEN"] = 403] = "FORBIDDEN";
    HttpStatus[HttpStatus["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpStatus[HttpStatus["CONFLICT"] = 409] = "CONFLICT";
    HttpStatus[HttpStatus["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(HttpStatus || (exports.HttpStatus = HttpStatus = {}));
var ErrorCodes;
(function (ErrorCodes) {
    ErrorCodes["BAD_REQUEST"] = "BAD_REQUEST";
    ErrorCodes["VALIDATION"] = "VALIDATION_ERROR";
    ErrorCodes["UNAUTHORIZED"] = "UNAUTHORIZED";
    ErrorCodes["FORBIDDEN"] = "FORBIDDEN";
    ErrorCodes["NOT_FOUND"] = "NOT_FOUND";
    ErrorCodes["CONFLICT"] = "CONFLICT";
    ErrorCodes["INTERNAL_SERVER_ERROR"] = "INTERNAL_SERVER_ERROR";
    ErrorCodes["PLACE_NOT_FOUND"] = "PLACE_NOT_FOUND";
    ErrorCodes["INVALID_ADDRESS"] = "INVALID_ADDRESS";
    ErrorCodes["INVALID_PLACE_ID"] = "INVALID_PLACE_ID";
})(ErrorCodes || (exports.ErrorCodes = ErrorCodes = {}));
//# sourceMappingURL=types.js.map