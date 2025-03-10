import { NextFunction, Request, Response } from 'express'
import { PlaceService } from '../services/place.service'
import { ControllerMethods } from '../types'

type PlaceControllerMethods = ControllerMethods & { getPlacesByCep: (req: Request, res: Response, next: NextFunction) => Promise<any> }

const locationService: PlaceService = new PlaceService()

const placeController: PlaceControllerMethods = {} as PlaceControllerMethods
placeController.create = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const newPlace = await locationService.createPlace(req.body)
    return res.status(201).json(newPlace)
}

placeController.listAll = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const locations = await locationService.getLocations()
    return res.status(200).json(locations)
}
placeController.update = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const location = await locationService.updateLocation(req.params.placeId, req.body)
    return res.status(200).json(location)
}
placeController.delete = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    await locationService.deleteLocation(req.params.placeId)
    return res.status(204).json()
}
placeController.getById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const location = await locationService.getLocationById(req.params.placeId)
    return res.status(200).json(location)
}
placeController.getPlacesByCep = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const location = await locationService.getLocationByCep(req.params.cep)
    return res.status(200).json(location)
}

export default placeController
