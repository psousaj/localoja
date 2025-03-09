import { AppDataSource } from "../database"
import { Place } from "../database/entities/place.entity"
import { Repository } from "typeorm"
import { GeolocationAPI } from "./geolocation.service"
import { BadRequestError } from "../utils/errors"
import { ErrorCodes } from "../types"
import { logger } from "../config/logger"

export class PlaceService {
    constructor(
        private placeRepository: Repository<Place> = AppDataSource.getRepository(Place),
        private geoLocationService = GeolocationAPI
    ) { }

    // async getLocationsByRadius(latitude: number, longitude: number, radius: number): Promise<Place[]> {
    // }
    async getGeoLocationByAddress(address: string) {
        const locations = await this.geoLocationService.getGeoLocationByAddress(address)
        return locations
    }

    async createPlace(place: Place): Promise<Place> {
        let pointObject
        if (place.lat && place.lng) {
            pointObject = {
                type: 'Point',
                coordinates: [place.lat, place.lng]
            }
        } else if (place.cep) {
            const geoLocations = await this.getGeoLocationByAddress(place.cep)
            pointObject = {
                type: 'Point',
                coordinates: [geoLocations[0].geometry.location.lat, geoLocations[0].geometry.location.lng]
            }
        } else {
            throw new BadRequestError(ErrorCodes.INVALID_ADDRESS, 'Invalid location! Please provide a valid CEP or latitude and longitude')
        }

        place.location = pointObject

        const newPlace = this.placeRepository.create({
            address: place.address,
            cep: place.cep,
            location: pointObject,
            city: place.city,
            state: place.state,
            country: place.country
        })

        logger.debug(`Created location: ${JSON.stringify(newPlace)}`)
        logger.debug(`${newPlace.location}, ${pointObject}`)

        return newPlace
    }

    async getLocationById(id: string): Promise<Place> {
        return this.placeRepository.findOneBy({ id })
    }
    async getLocationByCep(cep: string): Promise<Place> {
        return this.placeRepository.findOneBy({ cep })
    }

    async getLocations(): Promise<Place[]> {
        return this.placeRepository.find()
    }

    async updateLocation(id: string, location: Place): Promise<Place> {
        return this.placeRepository.update(id, location).then(() => location)
    }

    async deleteLocation(id: string): Promise<void> {
        this.placeRepository.delete(id)
    }
}