import { AppDataSource } from "../database"
import { Place } from "../database/entities/place.entity"
import { Repository } from "typeorm"
import { GeolocationAPI } from "./geolocation.service"
import { CreateLocationDto } from "../database/dto/create-location.dto"

export class LocationService {
    constructor(
        private locationRepository: Repository<Place> = AppDataSource.getRepository(Place),
        private geoLocationService = GeolocationAPI
    ) { }

    // async getLocationsByRadius(latitude: number, longitude: number, radius: number): Promise<Place[]> {
    // }
    async getGeoLocationByAddress(address: string) {
        const locations = await this.geoLocationService.getGeoLocationByAddress(address)
        return locations
    }

    async createLocation(place: CreateLocationDto): Promise<Place> {
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
            throw new Error('Invalid location! Please provide a valid CEP or latitude and longitude')
        }


        return this.locationRepository.create(place)
    }

    async getLocationById(id: string): Promise<Place> {
        return this.locationRepository.findOneBy({ id })
    }

    async getLocations(): Promise<Place[]> {
        return this.locationRepository.find()
    }

    async updateLocation(id: string, location: Place): Promise<Place> {
        return this.locationRepository.update(id, location).then(() => location)
    }

    async deleteLocation(id: string): Promise<void> {
        this.locationRepository.delete(id)
    }
}