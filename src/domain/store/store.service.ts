import { BadRequestException, ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { DeliveryService } from '../delivery/delivery.service';
import { PaginatedStoreResponse, PaginatedStoreWithFreteResponse } from '../dto/pagination.dto';
import { StoreResponseDto } from './dto/store-response.dto';
import { MapPin, RepoTags, StoreWithDistanceToCustomer } from '../../types';
import { GeoApiService } from '../geoapi/geoapi.service';

@Injectable()
export class StoreService {

  constructor(
    @Inject(RepoTags.STORE)
    private readonly storeRepository: Repository<Store>,
    @Inject()
    private readonly deliveryService: DeliveryService,
    @Inject()
    private readonly geoapiService: GeoApiService,
  ) { }

  async create(createStoreDto: CreateStoreDto) {
    const existingStore = await this.storeRepository.findOne({ where: { storeName: createStoreDto.storeName } });

    if (existingStore) {
      throw new ConflictException('Store already exists');
    }

    // Primeiro cria e salva a store para garantir que tenha um storeId
    const createdStore = this.storeRepository.create(createStoreDto);
    const savedStore = await this.storeRepository.save(createdStore);

    // Agora cria os deliveryConfigurations com a store já persistida
    const deliveryConfigurations = await this.deliveryService.createDefaultDeliveryConfigs(savedStore);
    // Define latitude e longitude
    const { latitude, longitude } = await this.geoapiService.getCoordinatesByStore(savedStore)

    savedStore.deliveryConfigurations = deliveryConfigurations;
    savedStore.latitude = String(latitude);
    savedStore.longitude = String(longitude);

    await this.storeRepository.save(savedStore);

    return savedStore;

  }

  async findAll(pagination: PaginatedStoreResponse): Promise<PaginatedStoreResponse> {
    const { offset, limit } = pagination || { offset: 0, limit: 100 };

    const [data, total] = await this.storeRepository.findAndCount({
      skip: offset,
      take: limit,
      relations: ['deliveryConfigurations'],
    });

    return {
      stores: data,
      total,
      offset,
      limit
    }
  }

  async findOne(storeId: string) {
    const store = await this.storeRepository.findOne({ where: { storeId }, relations: ['deliveryConfigurations'] });
    return {
      stores: [store ?? null],
      total: 1,
      offset: 0,
      limit: 1
    }
  }

  async findByUf(uf: string, pagination: PaginatedStoreResponse): Promise<PaginatedStoreResponse> {
    const { offset, limit } = pagination || { offset: 0, limit: 100 };
    if (!uf) {
      throw new BadRequestException('UF is required');
    }
    const uF = uf.toUpperCase();
    const [data, total] = await this.storeRepository.findAndCount({
      where: { state: uF },
      skip: offset,
      take: limit,
    });

    return {
      stores: data,
      total,
      offset,
      limit
    }
  }

  async update(storeId: string, updateStoreDto: UpdateStoreDto) {
    return await this.storeRepository.update(storeId, updateStoreDto).then(() => {
      return this.storeRepository.findOne({ where: { storeId } });
    });
  }

  async remove(storeId: string) {
    await this.storeRepository.delete(storeId)
  }

  async findFreteOptions(
    customerPostalCode: string,
    queryOptions?: PaginatedStoreWithFreteResponse
  ): Promise<PaginatedStoreWithFreteResponse> {
    const { offset = 0, limit = 100 } = queryOptions || { offset: 0, limit: 100 };

    // 1. Obtem endereço do cliente a partir do CEP
    const customerAddressDetails = await this.geoapiService.getAddressDetailsByPostalCode(customerPostalCode);

    // 2. Busca lojas com configurações de entrega
    const [stores, total] = await this.storeRepository.findAndCount({
      skip: offset,
      take: limit,
      relations: ['deliveryConfigurations']
    });

    // 3. Calcula distância do cliente para cada loja
    const storesWithDistanceToCustomer: StoreWithDistanceToCustomer[] = await Promise.all(
      stores.map(async (store) => {
        const routeDistance = await this.geoapiService.getRouteDistance(
          { latitude: Number(store.latitude), longitude: Number(store.longitude) },
          {
            latitude: Number(customerAddressDetails.latitude),
            longitude: Number(customerAddressDetails.longitude)
          }
        );

        return {
          ...store,
          distance: routeDistance
        };
      })
    );

    // 4. Gera os pins para o mapa
    const mapPins = storesWithDistanceToCustomer.map((store) => ({
      position: {
        lat: Number(store.latitude),
        lng: Number(store.longitude)
      },
      title: store.storeName
    } as MapPin
    ));

    // 5. Calcula as opções de entrega já formatadas por loja
    const formattedStores = await this.deliveryService.calculateShippingOptions(
      storesWithDistanceToCustomer,
      customerPostalCode
    );

    return {
      stores: formattedStores,
      pins: mapPins,
      limit,
      offset,
      total
    };
  }



}
