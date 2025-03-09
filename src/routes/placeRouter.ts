import express from 'express'
import placeController from '../controller/place.controller'
import { validateSchema, wrapAction } from '../utils'
import { createPlaceSchema } from '../schemas/zodSchemas'

const router = express.Router()

router.post('/place', validateSchema(createPlaceSchema), wrapAction(placeController.createLocation))

export default router