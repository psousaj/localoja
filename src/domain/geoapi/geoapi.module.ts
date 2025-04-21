import { Module } from '@nestjs/common';
import { MelhorEnvioService } from './melhorEnvio/melhorEnvio.service';
import { ViaCepService } from './via-cep/via-cep.service';
import { CacheService } from 'src/core/cache/cache.service';
import { EnvService } from 'src/config/env/env.service';
import { HttpModule } from '@nestjs/axios';
import { ProductModule } from '../product/product.module';
import { ProductService } from '../product/product.service';
import { GmapsService } from './gmaps/gmaps.service';
import { GeoApiService } from './geoapi.service';

@Module({
  imports: [
    HttpModule,
    ProductModule
  ],
  providers: [
    CacheService,
    EnvService,
    ProductService,
    GmapsService,
    ViaCepService,
    MelhorEnvioService,
    GeoApiService
  ],
  exports: [
    GeoApiService
  ]
})
export class GeoapiModule { }
