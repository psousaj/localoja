import { Module } from '@nestjs/common';
import { MelhorEnvioService } from './melhorEnvio/melhorEnvio.service';
import { GoogleMapsService } from './google-maps/google-maps.service';
import { ViaCepService } from './via-cep/via-cep.service';

@Module({
  providers: [MelhorEnvioService, GoogleMapsService, ViaCepService]
})
export class GeoapiModule { }
