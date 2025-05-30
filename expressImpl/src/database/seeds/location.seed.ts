import { Point } from "typeorm"
import { AppDataSource } from ".."
import { logger } from "../../config/logger"
import { PlaceType } from "../../types"
import { Place } from "../entities/place.entity"

const locations = [
    {
        name: "Azteca Calçados Pirajá",
        address: "Av. Ailton Gomes, 1660",
        city: "Juazeiro do Norte",
        state: "CE",
        country: "Brasil",
        cep: "63034-012",
        placeType: PlaceType.STORE,
        location: {
            type: "Point",
            coordinates: [-7.222379, -39.3137199],
        } as Point,
    },
    {
        name: "Azteca Calçados Centro",
        address: "R. São Luiz, 29",
        city: "Juazeiro do Norte",
        state: "CE",
        country: "Brasil",
        cep: "63010-125",
        placeType: PlaceType.STORE,
        location: {
            type: "Point",
            coordinates: [-7.2071561, -39.3174746],
        } as Point,
    },
    {
        name: "Azteca Calçados Matriz",
        address: "R. São Pedro, 504",
        city: "Juazeiro do Norte",
        state: "CE",
        country: "Brasil",
        cep: "63010-010",
        placeType: PlaceType.STORE,
        location: {
            type: "Point",
            coordinates: [-7.2035103, -39.3180094],
        } as Point,
    },
    {
        name: "Azteca Calçados Centro 02",
        address: "R. São Pedro, 696",
        city: "Juazeiro do Norte",
        state: "CE",
        country: "Brasil",
        cep: "63010-010",
        placeType: PlaceType.STORE,
        location: {
            type: "Point",
            coordinates: [-7.2052314, -39.3180235],
        } as Point,
    },
    {
        name: "Azteca Calçados Barbalha Centro",
        address: "R. Princesa Isabel, 88",
        city: "Barbalha",
        state: "CE",
        country: "Brasil",
        cep: "63180-000",
        placeType: PlaceType.STORE,
        location: {
            type: "Point",
            coordinates: [-7.311282, -39.3017165],
        } as Point,
    },
    {
        name: "Azteca Calçados Iguatu Centro",
        address: "R. FLoriano Peixoto, 593",
        city: "Iguatu",
        state: "CE",
        country: "Brasil",
        cep: "63500-050",
        placeType: PlaceType.STORE,
        location: {
            type: "Point",
            coordinates: [-6.3621888, -39.2974996],
        } as Point,
    },
    {
        name: "Azteca Calçados Brejo Santo",
        address: "R. Napoleão de Araujo Lima, 224",
        city: "Brejo Santo",
        state: "CE",
        country: "Brasil",
        cep: "63260-000",
        placeType: PlaceType.STORE,
        location: {
            type: "Point",
            coordinates: [-7.4936995, -38.9856467],
        } as Point,
    },
    {
        name: "Azteca Calçados Ico",
        address: "Av. Nogueira Acioly, 1196",
        city: "Ico",
        state: "CE",
        country: "Brasil",
        cep: "63430-000",
        placeType: PlaceType.STORE,
        location: {
            type: "Point",
            coordinates: [-6.4019784, -38.8600378],
        } as Point,
    },
    {
        name: "Azteca Calçados Crato 01",
        address: "R. Dr João Pessoa, 328",
        city: "Crato",
        state: "CE",
        country: "Brasil",
        cep: "63100-050",
        placeType: PlaceType.STORE,
        location: {
            type: "Point",
            coordinates: [-7.2319647, -39.4115015],
        } as Point,
    },
    {
        name: "Azteca Calçados Crato 02",
        address: "R. Dr João Pessoa, 386",
        city: "Crato",
        state: "CE",
        country: "Brasil",
        cep: "63100-050",
        placeType: PlaceType.STORE,
        location: {
            type: "Point",
            coordinates: [-7.2324506, -39.411766],
        } as Point,
    },
    {
        name: "Azteca Calçados Caucaia",
        address: "Av. Dom Almeida Lustosa, 2740",
        city: "Caucaia",
        state: "CE",
        country: "Brasil",
        cep: "61650-000",
        placeType: PlaceType.STORE,
        location: {
            type: "Point",
            coordinates: [-3.7661655, -38.6211067],
        } as Point,
    },
    {
        name: "Azteca Calçados Serra Talhada",
        address: "R. Enock Ignacio de Oliveira, 607",
        city: "Serra Talhada",
        state: "PE",
        country: "Brasil",
        cep: "56903-400",
        placeType: PlaceType.STORE,
        location: {
            type: "Point",
            coordinates: [-7.9904208, -38.3014753],
        } as Point,
    },
    {
        name: "Azteca Calçados Araripina",
        address: "R. Vereador Santiago Bringel, 81",
        city: "Araripina",
        state: "PE",
        country: "Brasil",
        cep: "56280-000",
        placeType: PlaceType.STORE,
        location: {
            type: "Point",
            coordinates: [-7.5758317, -40.4982745],
        } as Point,
    },
    {
        name: "Azteca Calçados Campina Grande",
        address: "R. Maciel Pinheiro, 157",
        city: "Campina Grande",
        state: "PB",
        country: "Brasil",
        cep: "58400-000",
        placeType: PlaceType.STORE,
        location: {
            type: "Point",
            coordinates: [-7.2183155, -35.8834047],
        } as Point,
    },
]


const seedDatabase = async () => {
    logger.debug('Iniciando seed de locais...')

    await AppDataSource.initialize()
    logger.debug('Banco de dados conectado')

    const placeRepo = AppDataSource.getRepository(Place)

    await Promise.all(
        locations.map(async (place) => {
            const exists = await placeRepo.findOneBy({ name: place.name })
            if (!exists) {
                await placeRepo.save(place)
                logger.debug(`Local ${place.name} inserido`)
            } else {
                logger.debug(`Local ${place.name} já existe, pulando...`)
            }
        })
    )

    logger.debug('Seed finalizada')
    await AppDataSource.destroy()
}


seedDatabase().catch((err) => logger.error('Erro ao rodar seed: ', err))