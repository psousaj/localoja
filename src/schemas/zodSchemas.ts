import { z } from "zod"

const createLocationSchema = z.object({
    name: z.string({ message: "Name is required" }).min(3),
    address: z.string({ message: "Address is required" }).min(3),
    cep: z.string().optional(),
    city: z.string({ message: "City is required" }).min(3),
    state: z.string({ message: "State is required" }).min(2),
    country: z.string({ message: "Country is required" }).min(3),
    lat: z.number().optional(),
    lng: z.number().optional(),
}).refine(data => data.cep || (data.lat && data.lng),
    {
        message: "CEP or both LAT and LNG are required",
        // path: ["cep_lat_lng"],
    }
)

export { createLocationSchema }
