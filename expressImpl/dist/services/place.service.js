"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceService = void 0;
const database_1 = require("../database");
const place_entity_1 = require("../database/entities/place.entity");
const typeorm_1 = require("typeorm");
const geolocation_service_1 = require("./geolocation.service");
const errors_1 = require("../utils/errors");
const types_1 = require("../types");
const logger_1 = require("../config/logger");
class PlaceService {
    constructor(placeRepository = database_1.AppDataSource.getRepository(place_entity_1.Place), geoLocationService = geolocation_service_1.GeolocationAPI) {
        this.placeRepository = placeRepository;
        this.geoLocationService = geoLocationService;
    }
    async getGeoLocationByAddress(address) {
        logger_1.logger.info(`Getting geo location by address: ${address}`);
        // const locations = await this.geoLocationService.getGeoLocationByAddress(encodeURIComponent(address))
        const locations = await this.geoLocationService.getGeoLocationByAddress(address);
        return locations;
    }
    async findAddressByCep(cep) {
        const placeAddress = await this.geoLocationService.getPlaceByCep(cep);
        if (!placeAddress) {
            throw new errors_1.BadRequestError(types_1.ErrorCodes.BAD_REQUEST, "CEP not found");
        }
        return placeAddress;
    }
    /**
     * Returns the saved places within a specified radius from the origin location.
     *
     * @param origin - The starting location from which distances are calculated.
     * @param radius - The maximum allowed radius in kilometers (default: 100 km).
     * @returns A list of places within the specified radius, including the calculated distance.
     */
    async getNearestPlaces(origin, radius = 100) {
        const savedPlaces = await this.getLocations();
        const placesWithDistance = await Promise.all(savedPlaces.map(async (place) => {
            const distance = await this.geoLocationService.getRoutesToPlace(origin, {
                latitude: place.location.coordinates[0],
                longitude: place.location.coordinates[1]
            });
            return { ...place, distanceToOrigin: distance };
        }));
        // Filter places that are within the specified radius
        return placesWithDistance
            .filter((place) => place.distanceToOrigin.distanceMeters <= radius * 1000) // Convert km to meters
            .sort((a, b) => a.distanceToOrigin.distanceMeters - b.distanceToOrigin.distanceMeters); //order from closest to farthest
    }
    async getLocationPoint(cep, lat, lng, place) {
        let pointObject;
        if (lat && lng) {
            pointObject = {
                type: 'Point',
                coordinates: [lat, lng]
            };
        }
        else if (cep) {
            const geoLocations = await this.getGeoLocationByAddress(`${place.address}, ${place.city} - ${place.state}, ${place.cep}, ${place.country}`
            // `${place.cep}`
            );
            pointObject = {
                type: 'Point',
                coordinates: [geoLocations[0].geometry.location.lat, geoLocations[0].geometry.location.lng]
            };
        }
        else {
            throw new errors_1.BadRequestError(types_1.ErrorCodes.INVALID_ADDRESS, 'Invalid location! Please provide a valid CEP or latitude and longitude');
        }
        return pointObject;
    }
    async findNearestPlaceByUserCep(cep) {
        const userLocationPoint = await this.findUserLocation(cep);
        const nearestPlaces = await this.getNearestPlaces({
            latitude: userLocationPoint.coordinates[0],
            longitude: userLocationPoint.coordinates[1]
        });
        return nearestPlaces;
    }
    async findUserLocation(cep) {
        const userLocation = await this.findAddressByCep(cep);
        const userPlace = {
            address: userLocation.logradouro,
            city: userLocation.localidade,
            state: userLocation.uf,
            country: 'Brazil',
            cep: userLocation.cep,
            name: 'User Location',
            placeType: types_1.PlaceType.USER_LOCATION
        };
        const userGeoLocationPoint = await this.getLocationPoint(cep, null, null, userPlace);
        return userGeoLocationPoint;
    }
    async createPlace(place) {
        const pointObject = await this.getLocationPoint(place.cep, place.lat, place.lng, place);
        const newPlace = this.placeRepository.create({
            ...place,
            location: pointObject,
        });
        try {
            await this.placeRepository.save(newPlace);
        }
        catch (error) {
            if (error instanceof typeorm_1.TypeORMError) {
                if (error.message.includes('duplicate key')) {
                    throw new errors_1.ConflictError(`Place with NAME ${place.name} and CEP ${place.cep} already exists!`);
                }
            }
            throw error;
        }
        return newPlace;
    }
    async getLocationById(id) {
        return this.placeRepository.findOneBy({ id });
    }
    async getPlacesByCep(cep) {
        return this.placeRepository.findOneBy({ cep });
    }
    async getLocations() {
        return this.placeRepository.find();
    }
    async updateLocation(id, location) {
        const pointObject = await this.getLocationPoint(location.cep, location.lat, location.lng, location);
        const placeWithNewLocation = {
            ...location,
            location: pointObject
        };
        await this.placeRepository.update(id, placeWithNewLocation);
        return this.placeRepository.findOneBy({ id });
    }
    async deleteLocation(id) {
        this.placeRepository.delete(id);
    }
}
exports.PlaceService = PlaceService;
//# sourceMappingURL=place.service.js.map