import { NextFunction, Request, Response } from 'express';
import { PlaceService } from '../services/place.service';

export class PlaceController {
    private static locationService = new PlaceService()

    static async create(req: Request, res: Response, next: NextFunction) {
        const newPlace = await this.locationService.createPlace(req.body)
        return res.status(201).json(newPlace)
    }

    static async listAll(req: Request, res: Response, next: NextFunction) {
        const locations = await this.locationService.getLocations()
        return res.status(200).json(locations)
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        const location = await this.locationService.updateLocation(req.params.placeId, req.body)
        return res.status(200).json(location)
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        await this.locationService.deleteLocation(req.params.placeId)
        return res.status(204).json()
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        const location = await this.locationService.getLocationById(req.params.placeId)
        return res.status(200).json(location)
    }

    static async getPlacesByCep(req: Request, res: Response, next: NextFunction) {
        const location = await this.locationService.getPlacesByCep(req.params.cep)
        return res.status(200).json(location)
    }

    static async nearest(req: Request, res: Response, next: NextFunction) {
        const locations = await this.locationService.findNearestPlaceByUserCep(req.params.cep)

        const response = {
            cep: req.params.cep,
            result: 'success',
            places: locations
        }

        return res.status(200).json(response)
    }
}

export default PlaceController
