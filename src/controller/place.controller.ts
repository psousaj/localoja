import { NextFunction, Request, Response } from 'express';
import { LocationService } from '../services/place.service';

const locationService: LocationService = new LocationService();

const placeController = {
    createLocation: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const newPlace = await locationService.createLocation(req.body)
        res.status(201).json(newPlace)
    }
}

export default placeController
