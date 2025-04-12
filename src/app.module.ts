import { Module } from '@nestjs/common';
import { ConfigModule as AppConfigModule } from './config/config.module';
import { CoreModule } from './core/core.module';
import { envSchema } from './config/env/env.validation'
import { ConfigModule } from '@nestjs/config';
import { PlaceModule } from './domain/place/place.module';
import { DatabaseModule } from './core/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AppConfigModule,
    CoreModule,
    PlaceModule,
    DatabaseModule
  ],
})
export class AppModule { }
