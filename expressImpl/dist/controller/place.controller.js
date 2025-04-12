"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceController = void 0;
const place_service_1 = require("../services/place.service");
const locationService = new place_service_1.PlaceService();
class PlaceController {
    static async create(req, res, next) {
        const newPlace = await locationService.createPlace(req.body);
        return res.status(201).json(newPlace);
    }
    static async listAll(req, res, next) {
        const { name, state, city } = req.query;
        let locations = await locationService.getLocations();
        if (name) {
            locations = locations.filter(location => location.name.toLowerCase().includes(String(name).toLowerCase()));
        }
        if (state) {
            locations = locations.filter(location => location.state.toLowerCase().includes(String(state).toLowerCase()));
        }
        if (city) {
            locations = locations.filter(location => location.city.toLowerCase().includes(String(city).toLowerCase()));
        }
        return res.status(200).json(locations);
    }
    static async update(req, res, next) {
        const location = await locationService.updateLocation(req.params.placeId, req.body);
        return res.status(200).json(location);
    }
    static async delete(req, res, next) {
        await locationService.deleteLocation(req.params.placeId);
        return res.status(204).json();
    }
    static async getById(req, res, next) {
        const location = await locationService.getLocationById(req.params.placeId);
        return res.status(200).json(location);
    }
    static async getPlacesByCep(req, res, next) {
        const location = await locationService.getPlacesByCep(req.params.cep);
        return res.status(200).json(location);
    }
    static async nearest(req, res, next) {
        const locations = await locationService.findNearestPlaceByUserCep(req.params.cep);
        const response = {
            cep: req.params.cep,
            result: 'success',
            places: locations
        };
        return res.status(200).json(response);
    }
}
exports.PlaceController = PlaceController;
exports.default = PlaceController;
//# sourceMappingURL=place.controller.js.map