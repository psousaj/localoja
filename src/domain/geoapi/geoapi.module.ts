import { Module } from '@nestjs/common';
import { MelhorEnvioService } from './melhorEnvio/melhorEnvio.service';
import { GoogleMapsService } from './google-maps/google-maps.service';
import { ViaCepService } from './via-cep/via-cep.service';
import { CacheService } from 'src/core/cache/cache.service';
import { EnvService } from 'src/config/env/env.service';
import { HttpModule } from '@nestjs/axios';
import { ProductModule } from '../product/product.module';
import { ProductService } from '../product/product.service';

@Module({
  imports: [
    HttpModule,
    ProductModule
  ],
  providers: [
    MelhorEnvioService,
    GoogleMapsService,
    ViaCepService,
    CacheService,
    EnvService,
    ProductService
  ],
  exports: [
    MelhorEnvioService,
    GoogleMapsService,
    ViaCepService,
  ]
})
export class GeoapiModule { }
