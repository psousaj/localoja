import { z } from "zod"
import { PlaceType } from "../types"

const _createPlaceSchema = z.object({
    name: z.string({ message: "Name is required" }).min(3),
    address: z.string({ message: "Address is required" }).min(3),
    city: z.string({ message: "City is required" }).min(3),
    state: z.string({ message: "State is required" }).min(2),
    country: z.string({ message: "Country is required at least 3 letters" }).min(3).optional().default("Brazil"),
    placeType: z.nativeEnum(PlaceType).optional().default(PlaceType.NOT_INFORMED),
    cep: z.string()
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
    lat: z.number().optional(),
    lng: z.number().optional(),
})

const createPlaceSchema = _createPlaceSchema.refine(
    data => data.cep || (data.lat && data.lng),
    {
        message: "CEP or both LAT and LNG are required",
        // path: ["cep_lat_lng"],
    }
)

const updatePlaceSchema = _createPlaceSchema
    .partial()
    .pick({ cep: true, lat: true, lng: true })
    .refine(
        data => data.cep || (data.lat && data.lng),
        {
            message: "CEP or both LAT and LNG are required",
            // path: ["cep_lat_lng"],
        }
    )


export { createPlaceSchema, updatePlaceSchema }
