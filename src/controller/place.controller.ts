import { NextFunction, Request, Response } from 'express';
import { PlaceService } from '../services/place.service';
import { logger } from '../config/logger';

const locationService: PlaceService = new PlaceService();

const placeController = {
    createLocation: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        logger.debug(`createLocation called ${JSON.stringify(req.body)}`)
        const newPlace = await locationService.createPlace(req.body)
        logger.debug(`Location created: ${JSON.stringify(newPlace)}`)
        return res.status(201).json(newPlace)
    }
}

export default placeController
