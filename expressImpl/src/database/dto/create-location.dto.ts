import { z } from "zod"
import { createPlaceSchema } from "../../schemas/zodSchemas"

type CreatePlaceDto = z.infer<typeof createPlaceSchema>

export {
    CreatePlaceDto
}