import { Place } from "@src/database/entities/place.entity";

export default interface IPlaceRepo {
    findBookByAuthor: (cep: string) => Promise<Place | undefined>;
    saveBook: (place: Place) => Promise<Place>;
    loanBook: (id: number) => Promise<void>;
    returnBook: (id: number) => Promise<void>;
}