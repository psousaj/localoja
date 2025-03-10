import { AppDataSource } from "../database"
import { Place } from "../database/entities/place.entity"
import { Point, Repository, TypeORMError } from "typeorm"
import { GeolocationAPI } from "./geolocation.service"
import { BadRequestError, ConflictError, } from "../utils/errors"
import { ErrorCodes, PlaceLocation, PlaceType, PointObject, RouteDistance } from "../types"
import { logger } from "../config/logger"
import { CreatePlaceDto } from "../database/dto/create-location.dto"

export class PlaceService {
    constructor(
        private placeRepository: Repository<Place> = AppDataSource.getRepository(Place),
        private geoLocationService = GeolocationAPI
    ) { }

    async getGeoLocationByAddress(address: string) {
        logger.debug(`Getting geo location by address: ${address}`)
        logger.debug(`Encoded Address: ${encodeURIComponent(address)}`)
        // const locations = await this.geoLocationService.getGeoLocationByAddress(encodeURIComponent(address))
        const locations = await this.geoLocationService.getGeoLocationByAddress(address)
        return locations
    }

    async findAddressByCep(cep: string) {
        return this.geoLocationService.getPlaceByCep(cep)
    }

    /**
     * Returns the saved places within a specified radius from the origin location.
     *
     * @param origin - The starting location from which distances are calculated.
     * @param radius - The maximum allowed radius in kilometers (default: 100 km).
     * @returns A list of places within the specified radius, including the calculated distance.
     */
    private async getNearestPlaces(
        origin: PlaceLocation,
        radius: number = 100
    ): Promise<(Place & { distanceToOrigin: RouteDistance })[]> {
        const savedPlaces = await this.getLocations()

        const placesWithDistance = await Promise.all(
            savedPlaces.map(async (place) => {
                const distance = await this.geoLocationService.getRoutesToPlace(
                    origin,
                    {
                        lat: place.location.coordinates[0],
                        lng: place.location.coordinates[1]
                    }
                );

                return { ...place, distanceToOrigin: distance };
            })
        )

        // Filter places that are within the specified radius
        return placesWithDistance.filter((place) => place.distanceToOrigin.distanceMeters <= radius * 1000) // Convert km to meters
    }

    private async getLocationPoint(cep?: string, lat?: number, lng?: number, place?: CreatePlaceDto): Promise<PointObject> {
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

    async findNearestPlaceByUserCep(cep: string) {
        const userLocationPoint = await this.findUserLocation(cep)
        const nearestPlaces = await this.getNearestPlaces({
            lat: userLocationPoint.coordinates[0],
            lng: userLocationPoint.coordinates[1]
        })
        return nearestPlaces
    }

    async findUserLocation(cep: string) {
        const userLocation = await this.findAddressByCep(cep)
        const userPlace = {
            address: userLocation.logradouro,
            city: userLocation.localidade,
            state: userLocation.uf,
            country: 'Brazil',
            cep: userLocation.cep,
            name: 'User Location',
            placeType: PlaceType.USER_LOCATION
        } as CreatePlaceDto

        const userGeoLocationPoint = await this.getLocationPoint(cep, null, null, userPlace)

        return userGeoLocationPoint
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

    async getPlacesByCep(cep: string): Promise<Place> {
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