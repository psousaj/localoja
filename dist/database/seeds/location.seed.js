"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const locations = [
    {
        name: "Azteca Calçados Pirajá",
        address: "Av. Ailton Gomes, 1660",
        city: "Juazeiro do Norte",
        state: "CE",
        country: "Brasil",
        cep: "63034-012",
        placeType: "store",
        location: {
            type: "Point",
            coordinates: [
                -7.222379,
                -39.3137199
            ]
        }
    },
    {
        name: "Azteca Calçados Centro",
        address: "R. São Luiz, 29",
        city: "Juazeiro do Norte",
        state: "CE",
        country: "Brasil",
        cep: "63010-125",
        placeType: "store",
        location: {
            type: "Point",
            coordinates: [
                -7.2071561,
                -39.3174746
            ]
        }
    },
    {
        name: "Azteca Calçados Matriz",
        address: "R. São Pedro, 504",
        city: "Juazeiro do Norte",
        state: "CE",
        country: "Brasil",
        cep: "63010-010",
        placeType: "store",
        location: {
            type: "Point",
            coordinates: [
                -7.2035103,
                -39.3180094
            ]
        }
    },
    {
        name: "Azteca Calçados Centro 02",
        address: "R. São Pedro, 696",
        city: "Juazeiro do Norte",
        state: "CE",
        country: "Brasil",
        cep: "63010-010",
        placeType: "store",
        location: {
            type: "Point",
            coordinates: [
                -7.2052314,
                -39.3180235
            ]
        }
    },
    {
        name: "Azteca Calçados Centro 01",
        address: "R. São Pedro, 756",
        city: "Juazeiro do Norte",
        state: "CE",
        country: "Brasil",
        cep: "63010-010",
        placeType: "store",
        location: {
            type: "Point",
            coordinates: [
                -7.2058257,
                -39.3179958
            ]
        }
    },
    {
        name: "Azteca Calçados Barbalha Centro",
        address: "R. Princesa Isabel, 88",
        city: "Barbalha",
        state: "CE",
        country: "Brasil",
        cep: "63180-000",
        placeType: "store",
        location: {
            type: "Point",
            coordinates: [
                -7.311282,
                -39.3017165
            ]
        }
    },
    {
        name: "Azteca Calçados Iguatu Centro",
        address: "R. FLoriano Peixoto, 593",
        city: "Iguatu",
        state: "CE",
        country: "Brasil",
        cep: "63500-050",
        placeType: "store",
        location: {
            type: "Point",
            coordinates: [
                -6.3621888,
                -39.2974996
            ]
        }
    },
    {
        name: "Azteca Calçados Brejo Santo",
        address: "R. Napoleão de Araujo Lima, 224",
        city: "Brejo Santo",
        state: "CE",
        country: "Brasil",
        cep: "63260-000",
        placeType: "store",
        location: {
            type: "Point",
            coordinates: [
                -7.4936995,
                -38.9856467
            ]
        }
    },
    {
        name: "Azteca Calçados Ico",
        address: "Av. Nogueira Acioly, 1196",
        city: "Ico",
        state: "CE",
        country: "Brasil",
        cep: "63430-000",
        placeType: "store",
        location: {
            type: "Point",
            coordinates: [
                -6.4019784,
                -38.8600378
            ]
        }
    },
    {
        name: "Azteca Calçados Crato 01",
        address: "R. Dr João Pessoa, 328",
        city: "Crato",
        state: "CE",
        country: "Brasil",
        cep: "63100-050",
        placeType: "store",
        location: {
            type: "Point",
            coordinates: [
                -7.2319647,
                -39.4115015
            ]
        }
    },
    {
        name: "Azteca Calçados Crato 02",
        address: "R. Dr João Pessoa, 386",
        city: "Crato",
        state: "CE",
        country: "Brasil",
        cep: "63100-050",
        placeType: "store",
        location: {
            type: "Point",
            coordinates: [
                -7.2324506,
                -39.411766
            ]
        }
    },
    {
        name: "Azteca Calçados Caucaia",
        address: "Av. Dom Almeida Lustosa, 2740",
        city: "Caucaia",
        state: "CE",
        country: "Brasil",
        cep: "61650-000",
        placeType: "store",
        location: {
            type: "Point",
            coordinates: [
                -3.7661655,
                -38.6211067
            ]
        }
    },
    {
        name: "Azteca Calçados Serra Talhada",
        address: "R. Enock Ignacio de Oliveira, 607",
        city: "Serra Talhada",
        state: "PE",
        country: "Brasil",
        cep: "56903-400",
        placeType: "store",
        location: {
            type: "Point",
            coordinates: [
                -7.9904208,
                -38.3014753
            ]
        }
    },
    {
        name: "Azteca Calçados Araripina",
        address: "R. Vereador Santiago Bringel, 81",
        city: "Araripina",
        state: "PE",
        country: "Brasil",
        cep: "56280-000",
        placeType: "store",
        location: {
            type: "Point",
            coordinates: [
                -7.5758317,
                -40.4982745
            ]
        }
    },
    {
        name: "Azteca Calçados Campina Grande",
        address: "R. Maciel Pinheiro, 157",
        city: "Campina Grande",
        state: "PB",
        country: "Brasil",
        cep: "58400-000",
        placeType: "store",
        location: {
            type: "Point",
            coordinates: [
                -7.2183155,
                -35.8834047
            ]
        }
    }
];
const seedDatabase = async () => {
    await __1.AppDataSource.initialize();
    console.log('Banco de dados conectado');
    const locationRepo = __1.AppDataSource.getRepository(Location);
    await locationRepo.save(locations);
    console.log('Dados inseridos com sucesso');
    await __1.AppDataSource.destroy();
};
seedDatabase().catch((err) => console.error('Erro ao rodar seed:', err));
//# sourceMappingURL=location.seed.js.map