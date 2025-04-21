import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryConfigurationService } from './delivery-config.service';
import { GeoapiModule } from '../geoapi/geoapi.module';

@Module({
  imports: [GeoapiModule],
  controllers: [],
  providers: [
    DeliveryService,
    DeliveryConfigurationService
  ],
})
export class DeliveryModule { }
