import { AppDataSource } from '@src/database';
import { Place } from '@src/database/entities/place.entity';
import IPlaceRepo from '@src/database/repository/placeRepo';
import { Repository } from 'typeorm';

export default class PlacesRepository implements IPlaceRepo {
    private ormRepository: Repository<Place>

    constructor() {
        this.ormRepository = AppDataSource.getRepository(Place);
    }
    findBookByAuthor: (cep: string) => Promise<Place | undefined>;
    saveBook: (place: Place) => Promise<Place>;
    loanBook: (id: number) => Promise<void>;
    returnBook: (id: number) => Promise<void>;
}