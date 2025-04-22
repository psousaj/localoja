import { Inject, Injectable } from '@nestjs/common';
import { DeliveryConfigurationService } from './delivery-config.service';
import { Store } from '../store/entities/store.entity';
import { Repository } from 'typeorm';
import { Delivery } from './entities/delivery.entity';
import { DeliveryCalculation } from './entities/delivery-calculation.entity';
import { RepoTags, ShippingOption, StoreType, StoreWithDistanceToCustomer, StoreWithFreteOptions } from '../../types';
import { GeoApiService } from '../geoapi/geoapi.service';

@Injectable()
export class DeliveryService {

  constructor(
    @Inject()
    private readonly deliveryConfigService: DeliveryConfigurationService,
    @Inject()
    private readonly geoapiService: GeoApiService,
    @Inject(RepoTags.DELIVERY)
    private readonly deliveryRepository: Repository<Delivery>,
    @Inject(RepoTags.DELIVERY_CALCULATION)
    private readonly deliveryCalculationRepository: Repository<DeliveryCalculation>
  ) { }

  getOrCreateDeliveryConfig(store: Store) {
    return this.deliveryConfigService.getOrCreateStoreConfig(store);
  }

  createDefaultDeliveryConfigs(store: Store) {
    return this.deliveryConfigService.createDefaultConfigs(store);
  }

  getDeliveryConfig(store: Store) {
    return this.deliveryConfigService.getDeliveryConfigs(store);
  }

  async calculateShippingOptions(
    storesWithDistance: StoreWithDistanceToCustomer[],
    customerPostalCode: string,
    productId?: number
  ): Promise<StoreWithFreteOptions[]> {
    const [PDVDeliveries, outOfRangeStores] = storesWithDistance.reduce(
      ([inRange, outRange], store) => {
        if (store.distance.distanceMeters <= 50000) {
          inRange.push(store);
        } else {
          outRange.push(store);
        }
        return [inRange, outRange];
      },
      [[], []] as [StoreWithDistanceToCustomer[], StoreWithDistanceToCustomer[]]
    );

    const stringifyDistance = (distance) => { return `${(distance.distanceMeters / 1000).toFixed(2)} km` }

    const getStoreWithFreteOptions = (
      store: StoreWithDistanceToCustomer,
      deliveryType: StoreType,
      shippingOptions: ShippingOption[]
    ): StoreWithFreteOptions => {
      return {
        name: store.storeName,
        city: store.city,
        postalCode: store.postalCode,
        type: deliveryType,
        distance: stringifyDistance(store.distance),
        value: shippingOptions
      };
    };

    const processStore = async (
      store: StoreWithDistanceToCustomer,
      deliveryType: StoreType
    ): Promise<StoreWithFreteOptions> => {
      const now = new Date();

      const existingCalculation = await this.deliveryCalculationRepository.findOne({
        where: {
          storeID: store.storeId,
          cep: customerPostalCode,
          deliveryType,
        },
      });

      if (existingCalculation && existingCalculation.expiresAt > now) {
        return getStoreWithFreteOptions(store, deliveryType, existingCalculation.shippingOptions);
      }

      const deliveryConfig = store.deliveryConfigurations!.find((dc) => dc.deliveryType === deliveryType);
      if (!deliveryConfig) throw new Error(`Delivery config missing for store ${store.storeId} and type ${deliveryType}`);

      let shippingOptions: ShippingOption[] = [];

      if (deliveryType === StoreType.PDV) {
        const totalDeliveryTime = deliveryConfig.extraDeliveryDays + store.shippingTimeInDays;

        shippingOptions = [
          {
            description: 'Motoboy da loja',
            price: 'R$ 15,00',
            prazo: `${totalDeliveryTime} dias úteis`,
          },
        ];

      } else {
        // Correios
        const correiosOptions = await this.geoapiService.getShippingOptions(
          store.postalCode,
          customerPostalCode,
          productId ?? 8
        );

        shippingOptions = correiosOptions.map(option => {
          const prazoBase = Number(option.prazo ?? option.custom_delivery_time ?? option.delivery_time ?? 0);
          const totalDeliveryTime = deliveryConfig.extraDeliveryDays + store.shippingTimeInDays + prazoBase;

          return {
            description: option.name,
            price: option.price,
            prazo: `${totalDeliveryTime} dias úteis`,
          };
        });
      }

      // Cria e salva no banco
      const deliveryCalculation = this.deliveryCalculationRepository.create({
        storeID: store.storeId,
        cep: customerPostalCode,
        deliveryType,
        shippingOptions,
      });

      await this.deliveryCalculationRepository.save(deliveryCalculation);

      // Retorna estrutura formatada para resposta
      return getStoreWithFreteOptions(store, deliveryType, shippingOptions);
    };

    // Processa todas as lojas
    const deliveries = await Promise.all([
      ...PDVDeliveries.map((store) => processStore(store, StoreType.PDV)),
      ...outOfRangeStores.map((store) => processStore(store, StoreType.LOJA)),
    ]);

    return deliveries;
  }

  // formatCorreiosOptions(description: string): any[] {
  //   try {
  //     const parsed = JSON.parse(description);
  //     return parsed.map((option: any) => ({
  //       prazo: `${option.prazo} dias úteis`,
  //       codProdutoAgencia: option.codProdutoAgencia,
  //       price: option.price,
  //       description: option.description
  //     }));
  //   } catch {
  //     return [];
  //   }
  // }


  findAll() {
    return `This action returns all delivery`;
  }

  findOne(id: number) {
    return `This action returns a #${id} delivery`;
  }

  remove(id: number) {
    return `This action removes a #${id} delivery`;
  }
}
