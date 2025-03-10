import { AppDataSource } from "../database"
import { Place } from "../database/entities/place.entity"
import { Repository, TypeORMError } from "typeorm"
import { GeolocationAPI } from "./geolocation.service"
import { BadRequestError, ConflictError, } from "../utils/errors"
import { ErrorCodes } from "../types"
import { logger } from "../config/logger"
import { CreatePlaceDto } from "../database/dto/create-location.dto"
import { add } from "winston"

export class PlaceService {
    constructor(
        private placeRepository: Repository<Place> = AppDataSource.getRepository(Place),
        private geoLocationService = GeolocationAPI
    ) { }

    // async getLocationsByRadius(latitude: number, longitude: number, radius: number): Promise<Place[]> {
    // }
    async getGeoLocationByAddress(address: string) {
        logger.debug(`Getting geo location by address: ${address}`)
        logger.debug(`Encoded Address: ${encodeURIComponent(address)}`)
        // const locations = await this.geoLocationService.getGeoLocationByAddress(encodeURIComponent(address))
        const locations = await this.geoLocationService.getGeoLocationByAddress(address)
        return locations
    }

    private async getLocationPoint(cep?: string, lat?: number, lng?: number, place?: CreatePlaceDto) {
        let pointObject

        if (lat && lng) {
            pointObject = {
                type: 'Point',
                coordinates: [lat, lng]
            }
        } else if (cep) {
            const geoLocations = await this.getGeoLocationByAddress(
                `${place.address}, ${place.city} - ${place.state}, ${place.cep}, ${place.country}`
                // `${place.cep}`
            )
            pointObject = {
                type: 'Point',
                coordinates: [geoLocations[0].geometry.location.lat, geoLocations[0].geometry.location.lng]
            }
        } else {
            throw new BadRequestError(ErrorCodes.INVALID_ADDRESS, 'Invalid location! Please provide a valid CEP or latitude and longitude')
        }

        return pointObject
    }

    async createPlace(place: CreatePlaceDto): Promise<Place> {
        const pointObject = await this.getLocationPoint(place.cep, place.lat, place.lng, place)

        const newPlace = this.placeRepository.create({
            ...place,
            location: pointObject,
        });

        try {
            await this.placeRepository.save(newPlace)
        } catch (error: any) {
            if (error instanceof TypeORMError) {
                if (error.message.includes('duplicate key')) {
                    throw new ConflictError(`Place with NAME ${place.name} and CEP ${place.cep} already exists!`)
                }
            }
            throw error
        }

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

    async updateLocation(id: string, location: Partial<CreatePlaceDto>): Promise<Place> {
        const pointObject = await this.getLocationPoint(location.cep, location.lat, location.lng, location)
        const placeWithNewLocation = {
            ...location,
            location: pointObject
        }

        await this.placeRepository.update(id, placeWithNewLocation)
        return this.placeRepository.findOneBy({ id })
    }


    async deleteLocation(id: string): Promise<void> {
        this.placeRepository.delete(id)
    }
}