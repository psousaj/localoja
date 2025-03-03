import { repositoryProviders } from '../database'

import { Repository } from 'typeorm';
import { Place } from '../database/entities/place.entity';

export class PlaceController {
    private placeRepository: Repository<Place>;

    constructor(placeRepository: Repository<Place>) {
        this.placeRepository = placeRepository;
    }

    // Add your methods here
}