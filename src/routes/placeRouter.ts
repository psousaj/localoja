import express from 'express'
import placeController from '../controller/place.controller'

const router = express.Router()

router.post('/place', placeController.createLocation)

export default router