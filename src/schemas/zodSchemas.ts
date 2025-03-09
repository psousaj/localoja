import { z } from "zod"
import { PlaceType } from "../types"

const createPlaceSchema = z.object({
    name: z.string({ message: "Name is required" }).min(3),
    address: z.string({ message: "Address is required" }).min(3),
    city: z.string({ message: "City is required" }).min(3),
    state: z.string({ message: "State is required" }).min(2),
    country: z.string({ message: "Country is required at least 3 letters" }).min(3).optional().default("Brasil"),
    type: z.nativeEnum(PlaceType).optional().default(PlaceType.NOT_INFORMED),
    cep: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
}).refine(data => data.cep || (data.lat && data.lng),
    {
        message: "CEP or both LAT and LNG are required",
        // path: ["cep_lat_lng"],
    }
)

export { createPlaceSchema }
