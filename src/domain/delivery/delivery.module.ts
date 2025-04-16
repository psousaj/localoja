import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryConfigurationService } from './delivery-config.service';

@Module({
  controllers: [],
  providers: [
    DeliveryService,
    DeliveryConfigurationService
  ],
})
export class DeliveryModule { }
