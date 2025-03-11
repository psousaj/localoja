import express from 'express'
import placeController from '../controller/place.controller'
import { validateBodySchema, validateParamsSchema, wrapAction } from '../utils'
import { createPlaceSchema, nearestPlaceSchema, updatePlaceSchema } from '../schemas/zodSchemas'

const router = express.Router()

router.post('/places', validateBodySchema(createPlaceSchema), wrapAction(placeController.create))
router.get('/places', wrapAction(placeController.listAll))
router.get('/places/nearest/:cep', validateParamsSchema(nearestPlaceSchema), wrapAction(placeController.nearest))
router.patch('/places/:placeId', validateBodySchema(updatePlaceSchema), wrapAction(placeController.update))
router.get('/places/:placeId', wrapAction(placeController.getById))
router.get('/places/:placeId', wrapAction(placeController.getPlacesByCep))
router.delete('/places/:placeId', wrapAction(placeController.delete))

export default router       