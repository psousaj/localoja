import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { DeliveryService } from '../delivery/delivery.service';
import { DeliveryConfigurationService } from '../delivery/delivery-config.service';
import { GeoapiModule } from '../geoapi/geoapi.module';

@Module({
  imports: [GeoapiModule],
  providers: [StoreService, DeliveryService, DeliveryConfigurationService],
  controllers: [StoreController],
})
export class StoreModule { }
