import { Module } from '@nestjs/common';
import { ConfigModule as AppConfigModule } from './config/config.module';
import { CoreModule } from './core/core.module';
import { envSchema } from './config/env/env.validation'
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './domain/auth/auth.module';
import { GeoapiModule } from './domain/geoapi/geoapi.module';
import { DeliveryModule } from './domain/delivery/delivery.module';
import { DatabaseModule } from './core/database/database.module';
import { StoreModule } from './domain/store/store.module';
import { EnvModule } from './config/env/env.module';
import { LoggerModule } from './core/logger/logger.module';
import { ProductModule } from './domain/product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AppConfigModule,
    CoreModule,
    DatabaseModule,
    AuthModule,
    DeliveryModule,
    GeoapiModule,
    StoreModule,
    EnvModule,
    LoggerModule,
    ProductModule
  ],
})
export class AppModule { }
