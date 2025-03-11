import { NextFunction, Request, Response } from 'express'
import { PlaceService } from '../services/place.service'

const locationService = new PlaceService()

export class PlaceController {

    static async create(req: Request, res: Response, next: NextFunction) {
        const newPlace = await locationService.createPlace(req.body)
        return res.status(201).json(newPlace)
    }

    static async listAll(req: Request, res: Response, next: NextFunction) {
        const { name, state, city } = req.query

        let locations = await locationService.getLocations()

        if (name) {
            locations = locations.filter(location =>
                location.name.toLowerCase().includes(String(name).toLowerCase())
            )
        }

        if (state) {
            locations = locations.filter(location =>
                location.state.toLowerCase().includes(String(state).toLowerCase())
            )
        }

        if (city) {
            locations = locations.filter(location =>
                location.city.toLowerCase().includes(String(city).toLowerCase())
            )
        }

        return res.status(200).json(locations)
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        const location = await locationService.updateLocation(req.params.placeId, req.body)
        return res.status(200).json(location)
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        await locationService.deleteLocation(req.params.placeId)
        return res.status(204).json()
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        const location = await locationService.getLocationById(req.params.placeId)
        return res.status(200).json(location)
    }

    static async getPlacesByCep(req: Request, res: Response, next: NextFunction) {
        const location = await locationService.getPlacesByCep(req.params.cep)
        return res.status(200).json(location)
    }

    static async nearest(req: Request, res: Response, next: NextFunction) {
        const locations = await locationService.findNearestPlaceByUserCep(req.params.cep)

        const response = {
            cep: req.params.cep,
            result: 'success',
            places: locations
        }

        return res.status(200).json(response)
    }
}

export default PlaceController
