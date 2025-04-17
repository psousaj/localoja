import { Logger } from "@nestjs/common";
import * as path from 'path';
import { parsedEnv } from "src/config/env/env.validation";
import { DeliveryConfiguration } from "src/domain/delivery/entities/delivery-config.entity";
import { Store } from "src/domain/store/entities/store.entity";
import { StoreType } from "src/types";
import { DataSource, Repository } from "typeorm";

const logger = new Logger('Seed')

if (!parsedEnv.success) {
    logger.error('Environment variables not loaded correctly')
    process.exit(1)
}
const env = parsedEnv.data

const storeSeed = [
    {
        storeName: "Azteca Calçados Pirajá",
        address1: "Av. Ailton Gomes, 1660",
        city: "Juazeiro do Norte",
        state: "CE",
        country: "Brasil",
        postalCode: "63034-012",
        type: StoreType.LOJA,
        latitude: "-7.222379",
        longitude: "-39.3137199",
        shippingTimeInDays: 3,
        takeOutInLOJA: true,
    },
    {
        storeName: "Azteca Calçados Centro",
        address1: "R. São Luiz, 29",
        city: "Juazeiro do Norte",
        state: "CE",
        country: "Brasil",
        postalCode: "63010-125",
        type: StoreType.LOJA,
        latitude: "-7.2071561",
        longitude: "-39.3174746",
        shippingTimeInDays: 3,
        takeOutInLOJA: true,
    },
    {
        storeName: "Azteca Calçados Matriz",
        address1: "R. São Pedro, 504",
        city: "Juazeiro do Norte",
        state: "CE",
        country: "Brasil",
        postalCode: "63010-010",
        type: StoreType.LOJA,
        latitude: "-7.2035103",
        longitude: "-39.3180094",
        shippingTimeInDays: 3,
        takeOutInLOJA: true,
    },
    {
        storeName: "Azteca Calçados Centro 02",
        address1: "R. São Pedro, 696",
        city: "Juazeiro do Norte",
        state: "CE",
        country: "Brasil",
        postalCode: "63010-010",
        type: StoreType.LOJA,
        latitude: "-7.2052314",
        longitude: "-39.3180235",
        shippingTimeInDays: 3,
        takeOutInLOJA: true,
    },
    {
        storeName: "Azteca Calçados Barbalha Centro",
        address1: "R. Princesa Isabel, 88",
        city: "Barbalha",
        state: "CE",
        country: "Brasil",
        postalCode: "63180-000",
        type: StoreType.LOJA,
        latitude: "-7.311282",
        longitude: "-39.3017165",
        shippingTimeInDays: 3,
        takeOutInLOJA: true,
    },
    {
        storeName: "Azteca Calçados Iguatu Centro",
        address1: "R. FLoriano Peixoto, 593",
        city: "Iguatu",
        state: "CE",
        country: "Brasil",
        postalCode: "63500-050",
        type: StoreType.LOJA,
        latitude: "-6.3621888",
        longitude: "-39.2974996",
        shippingTimeInDays: 3,
        takeOutInLOJA: true,
    },
    {
        storeName: "Azteca Calçados Brejo Santo",
        address1: "R. Napoleão de Araujo Lima, 224",
        city: "Brejo Santo",
        state: "CE",
        country: "Brasil",
        postalCode: "63260-000",
        type: StoreType.LOJA,
        latitude: "-7.4936995",
        longitude: "-38.9856467",
        shippingTimeInDays: 3,
        takeOutInLOJA: true,
    },
    {
        storeName: "Azteca Calçados Ico",
        address1: "Av. Nogueira Acioly, 1196",
        city: "Ico",
        state: "CE",
        country: "Brasil",
        postalCode: "63430-000",
        type: StoreType.LOJA,
        latitude: "-6.4019784",
        longitude: "-38.8600378",
        shippingTimeInDays: 3,
        takeOutInLOJA: true,
    },
    {
        storeName: "Azteca Calçados Crato 01",
        address1: "R. Dr João Pessoa, 328",
        city: "Crato",
        state: "CE",
        country: "Brasil",
        postalCode: "63100-050",
        type: StoreType.LOJA,
        latitude: "-7.2319647",
        longitude: "-39.4115015",
        shippingTimeInDays: 3,
        takeOutInLOJA: true,
    },
    {
        storeName: "Azteca Calçados Crato 02",
        address1: "R. Dr João Pessoa, 386",
        city: "Crato",
        state: "CE",
        country: "Brasil",
        postalCode: "63100-050",
        type: StoreType.LOJA,
        latitude: "-7.2324506",
        longitude: "-39.411766",
        shippingTimeInDays: 3,
        takeOutInLOJA: true,
    },
    {
        storeName: "Azteca Calçados Caucaia",
        address1: "Av. Dom Almeida Lustosa, 2740",
        city: "Caucaia",
        state: "CE",
        country: "Brasil",
        postalCode: "61650-000",
        type: StoreType.LOJA,
        latitude: "-3.7661655",
        longitude: "-38.6211067",
        shippingTimeInDays: 3,
        takeOutInLOJA: true,
    },
    {
        storeName: "Azteca Calçados Serra Talhada",
        address1: "R. Enock Ignacio de Oliveira, 607",
        city: "Serra Talhada",
        state: "PE",
        country: "Brasil",
        postalCode: "56903-400",
        type: StoreType.LOJA,
        latitude: "-7.9904208",
        longitude: "-38.3014753",
        shippingTimeInDays: 3,
        takeOutInLOJA: true,
    },
    {
        storeName: "Azteca Calçados Araripina",
        address1: "R. Vereador Santiago Bringel, 81",
        city: "Araripina",
        state: "PE",
        country: "Brasil",
        postalCode: "56280-000",
        type: StoreType.LOJA,
        latitude: "-7.5758317",
        longitude: "-40.4982745",
        shippingTimeInDays: 3,
        takeOutInLOJA: true,
    },
    {
        storeName: "Azteca Calçados Campina Grande",
        address1: "R. Maciel Pinheiro, 157",
        city: "Campina Grande",
        state: "PB",
        country: "Brasil",
        postalCode: "58400-000",
        type: StoreType.LOJA,
        latitude: "-7.2183155",
        longitude: "-35.8834047",
        shippingTimeInDays: 3,
        takeOutInLOJA: true,
    },
];

const AppDataSource = new DataSource({
    type: 'postgres',
    host: env.PGHOST,
    port: 5432,
    username: env.PGUSER,
    password: env.PGPASSWORD,
    database: env.PGDATABASE,
    entities: [Store, DeliveryConfiguration],
    synchronize: env.NODE_ENV !== 'production',
    ssl: true,
})

const createDefaultDeliveryConfigs = async (
    storeId: string,
    deliveryRepo: Repository<DeliveryConfiguration>
): Promise<DeliveryConfiguration[]> => {
    // Busca a entidade Store associada ao storeId
    const store = await deliveryRepo.manager.getRepository(Store).findOneByOrFail({ storeId });

    // Verifica se já existem configs
    const existingConfigs = await deliveryRepo.find({
        where: { storeID: storeId }
    });

    // Determina quais tipos ainda faltam ser criados
    const missingTypes = [StoreType.LOJA, StoreType.PDV].filter(
        type => !existingConfigs.some(cfg => cfg.deliveryType === type)
    );

    // Se não falta nada, retorna as existentes
    if (missingTypes.length === 0) {
        return existingConfigs;
    }

    // Cria as configs faltantes com todos os campos obrigatórios
    const newConfigs = missingTypes.map(type =>
        deliveryRepo.create({
            storeID: storeId,
            store: store, // vincula entidade store
            deliveryType: type,
            shippingTimeInDays: 3,
            extraDeliveryDays: 0,
            prazoMotoboy: 2,
            active: true,
        })
    );

    // Salva no banco
    const savedConfigs = await deliveryRepo.save(newConfigs);

    // Retorna todas (existentes + novas)
    return [...existingConfigs, ...savedConfigs];
};


export const seedStores = async () => {
    const dataSource = await AppDataSource.initialize()
    const storeRepository = dataSource.getRepository(Store)
    const deliveryRepository = dataSource.getRepository(DeliveryConfiguration)

    logger.log('Iniciando seed de lojas...')

    for (const storeData of storeSeed) {
        const exists = await storeRepository.findOneBy({ storeName: storeData.storeName })

        if (!exists) {
            const newStore = storeRepository.create(storeData)
            const savedStore = await storeRepository.save(newStore)
            await createDefaultDeliveryConfigs(savedStore.storeId, deliveryRepository);
            logger.log(`Loja ${storeData.storeName} inserida`)
        } else {
            logger.log(`Loja ${storeData.storeName} já existe, pulando...`)
        }
    }

    logger.log('Seed de lojas finalizada!')
}


seedStores()