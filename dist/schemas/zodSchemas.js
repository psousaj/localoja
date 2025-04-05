"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nearestPlaceSchema = exports.updatePlaceSchema = exports.createPlaceSchema = void 0;
const zod_1 = require("zod");
const types_1 = require("../types");
const nearestPlaceSchema = zod_1.z.object({
    cep: zod_1.z.string({ message: "CEP is required" })
        .trim()
        .min(8)
        .max(9)
        .refine(cep => /^[0-9]{8}$|^[0-9]{5}-[0-9]{3}$/.test(cep), {
        message: "CEP must be in the format 63000000 or 63000-000"
    })
});
exports.nearestPlaceSchema = nearestPlaceSchema;
const _createPlaceSchema = zod_1.z.object({
    name: zod_1.z.string({ message: "Name is required" }).min(3),
    address: zod_1.z.string({ message: "Address is required" }).min(3),
    city: zod_1.z.string({ message: "City is required" }).min(3),
    state: zod_1.z.string({ message: "State is required" }).min(2),
    country: zod_1.z.string({ message: "Country is required at least 3 letters" }).min(3).optional().default("Brazil"),
    placeType: zod_1.z.nativeEnum(types_1.PlaceType).optional().default(types_1.PlaceType.NOT_INFORMED),
    cep: zod_1.z.string()
        .trim()
        .min(8)
        .max(9)
        .refine(cep => /^[0-9]{8}$|^[0-9]{5}-[0-9]{3}$/.test(cep), {
        message: "CEP must be in the format 63000000 or 63000-000"
    })
        // .transform(cep => {
        //     if (/^[0-9]{5}-[0-9]{3}$/.test(cep)) return cep
        //     return `${cep.slice(0, 5)}-${cep.slice(5)}`
        // })
        .optional(),
    lat: zod_1.z.number().optional(),
    lng: zod_1.z.number().optional(),
});
const createPlaceSchema = _createPlaceSchema.refine(data => data.cep || (data.lat && data.lng), {
    message: "CEP or both LAT and LNG are required",
    // path: ["cep_lat_lng"],
});
exports.createPlaceSchema = createPlaceSchema;
const updatePlaceSchema = _createPlaceSchema
    .partial()
    .pick({ cep: true, lat: true, lng: true })
    .refine(data => data.cep || (data.lat && data.lng), {
    message: "CEP or both LAT and LNG are required",
    // path: ["cep_lat_lng"],
});
exports.updatePlaceSchema = updatePlaceSchema;
//# sourceMappingURL=zodSchemas.js.map