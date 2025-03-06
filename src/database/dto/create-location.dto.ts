export class CreateLocationDto {
    address: string
    lat?: number
    lng?: number
    cep?: string
    city: string
    state: string
    country: string
}