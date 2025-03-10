import express from 'express'
import placeController from '../controller/place.controller'
import { validateSchema, wrapAction } from '../utils'
import { createPlaceSchema, updatePlaceSchema } from '../schemas/zodSchemas'

const router = express.Router()

router.post('/places', validateSchema(createPlaceSchema), wrapAction(placeController.create))
router.get('/places', wrapAction(placeController.listAll))
router.patch('/places/:placeId', validateSchema(updatePlaceSchema), wrapAction(placeController.update))
router.get('/places/:placeId', wrapAction(placeController.getById))
router.get('/places/:placeId', wrapAction(placeController.getPlacesByCep))
router.delete('/places/:placeId', wrapAction(placeController.delete))

export default router       