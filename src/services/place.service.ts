import { Place } from "src/database/entities/place.entity";
import { Repository } from "typeorm";

export class LocationService {
    constructor(
        private locationRepository: Repository<Place>
    ) { }

    async createLocation(location: Place): Promise<Place> {
        return this.locationRepository.create(location);
    }

    async getLocationById(id: string): Promise<Place> {
        return this.locationRepository.findOneBy({ id })
    }

    async getLocations(): Promise<Place[]> {
        return this.locationRepository.find();
    }

    async updateLocation(id: string, location: Place): Promise<Place> {
        return this.locationRepository.update(id, location).then(() => location)
    }

    async deleteLocation(id: string): Promise<void> {
        this.locationRepository.delete(id)
    }
}