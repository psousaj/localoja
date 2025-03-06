import { HttpStatus } from "../../types";


class BaseError extends Error {
    constructor(statusCode: HttpStatus) {
        super()
    }
}