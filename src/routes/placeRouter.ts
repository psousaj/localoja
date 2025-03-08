import express from 'express'
import placeController from '../controller/place.controller'
import { validateSchema, wrapAction } from '../utils'
import { createLocationSchema } from '../schemas/zodSchemas'

const router = express.Router()

router.post('/place', validateSchema(createLocationSchema), wrapAction(placeController.createLocation))

export default router