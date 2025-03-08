import express from 'express'
import placeController from '../controller/place.controller'
import { wrapAction } from '../utils'

const router = express.Router()

router.post('/place', wrapAction(placeController.createLocation))

export default router