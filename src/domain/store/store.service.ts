import { BadRequestException, ConflictException, Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { DeliveryService } from '../delivery/delivery.service';
import { PaginationDto } from '../dto/pagination.dto';
import { StoreResponseDto } from './dto/store-response.dto';
import { RepoTags } from 'src/types';
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
    const [lat, lng] = await this.geoapiService.getCoordinatesByStore(savedStore)

    savedStore.deliveryConfigurations = deliveryConfigurations;
    savedStore.latitude = String(lat);
    savedStore.longitude = String(lng);

    await this.storeRepository.save(savedStore);

    return savedStore;

  }

  async findAll(pagination: PaginationDto): Promise<StoreResponseDto> {
    const { offset = 0, limit = 100 } = pagination;

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

  async findByUf(uf: string, pagination: PaginationDto) {
    const { offset = 0, limit = 100 } = pagination;
    if (!uf) {
      throw new BadRequestException('UF is required');
    }
    const uF = uf.toUpperCase();
    const [data, total] = await this.storeRepository.findAndCount({ where: { state: uF, } });

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

  // Cliente informa CEP
  // ↓
  // DeliveryService chama geoApiService.getAddressByCep()
  // ↓
  // Consulta todas as lojas (StoreService.findAll())
  // ↓
  // Para cada loja, geoApiService.getDistance()
  // ↓
  // Define tipo da entrega: PDV ou LOJA
  // ↓
  // Se PDV: cálculo local
  // Se LOJA: geoApiService.getShippingOptions()
  // ↓
  // Gera a resposta com os prazos e valores
  // ↓
  // Opcional: salva em DeliveryCalculation
  async findFreteOptions(customerPostalCode: string) {
    const customerAddressDetails = await this.geoapiService.getAddressDetailsByPostalCode(customerPostalCode)
    const stores = await this.storeRepository.find({ relations: ['deliveryConfigurations'] });

    if (!customerAddressDetails || customerAddressDetails.erro) {
      throw new UnprocessableEntityException(`Invalid postal code: ${customerPostalCode}${customerAddressDetails?.erro
          ? ' - ' + customerAddressDetails.erro
          : ''
        }`);
    }
  }
}
