import { Inject, Injectable } from '@nestjs/common';
import { DeliveryConfigurationService } from './delivery-config.service';
import { Store } from '../store/entities/store.entity';
import { Repository } from 'typeorm';
import { Delivery } from './entities/delivery.entity';
import { DeliveryCalculation } from './entities/delivery-calculation.entity';
import { RepoTags, StoreType, StoreWithDistanceToCustomer } from 'src/types';
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
  ): Promise<DeliveryCalculation[]> {
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

    const processStore = async (
      store: StoreWithDistanceToCustomer,
      deliveryType: StoreType
    ): Promise<DeliveryCalculation[]> => {
      const now = new Date();

      // Verifica se já existe cálculo válido
      const existingCalculation = await this.deliveryCalculationRepository.findOne({
        where: {
          storeID: store.storeId,
          cep: customerPostalCode,
          deliveryType,
        },
      });

      if (existingCalculation && existingCalculation.expiresAt > now) {
        return [existingCalculation]; // Retorna o cálculo existente
      }

      let shippingOptions: any[] = [];
      let deliveryCalculations: DeliveryCalculation[] = [];

      if (deliveryType === StoreType.PDV) {
        // Lógica para lojas dentro de 50 km (motoboy da loja)
        const deliveryConfig = store.deliveryConfigurations.find((dc) => dc.deliveryType === deliveryType)!;
        const totalDeliveryTime = deliveryConfig.shippingTimeInDays + deliveryConfig.extraDeliveryDays;

        // Adiciona o cálculo do motoboy (valor fixo)
        const motoboyCalculation = this.deliveryCalculationRepository.create({
          storeID: store.storeId,
          cep: customerPostalCode,
          deliveryType,
          distanceInKm: store.distance.distanceMeters / 1000,
          estimatedTimeInDays: totalDeliveryTime,
          price: 'R$ 15,00', // Valor fixo para motoboy
          description: 'Motoboy da loja',
        });

        deliveryCalculations.push(await this.deliveryCalculationRepository.save(motoboyCalculation));

      } else {
        // Lógica para lojas fora de 50 km (via Correios)
        shippingOptions = await this.geoapiService.getShippingOptions(
          store.postalCode,
          customerPostalCode,
          productId ?? 8 // ID do produto padrão
        );

        // Itera sobre as opções de frete dos Correios
        const deliveryConfig = store.deliveryConfigurations.find((dc) => dc.deliveryType === deliveryType)!;

        for (const shippingOption of shippingOptions) {
          const totalDeliveryTime = deliveryConfig.shippingTimeInDays + deliveryConfig.extraDeliveryDays + shippingOption.estimatedTimeInDays;

          const newCalculation = this.deliveryCalculationRepository.create({
            storeID: store.storeId,
            cep: customerPostalCode,
            deliveryType,
            distanceInKm: store.distance.distanceMeters / 1000,
            estimatedTimeInDays: totalDeliveryTime,
            price: shippingOption.price,
            description: shippingOption.description,
            expiresAt: new Date(now.getTime() + 3600 * 1000 * 24), // Expira em 1 dia
          });

          deliveryCalculations.push(await this.deliveryCalculationRepository.save(newCalculation));
        }
      }

      return deliveryCalculations;
    };

    // Processa todas as lojas dos dois grupos
    const deliveries = await Promise.all([
      ...PDVDeliveries.map((store) => processStore(store, StoreType.PDV)),
      ...outOfRangeStores.map((store) => processStore(store, StoreType.LOJA)),
    ]);

    // Achata o array de arrays para retornar um único array de cálculos de entrega
    return deliveries.flat();
  }

  formatCorreiosOptions(description: string): any[] {
    try {
      const parsed = JSON.parse(description);
      return parsed.map((option: any) => ({
        prazo: `${option.prazo} dias úteis`,
        codProdutoAgencia: option.codProdutoAgencia,
        price: option.price,
        description: option.description
      }));
    } catch {
      return [];
    }
  }


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
