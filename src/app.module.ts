import { Module } from '@nestjs/common';
import { ConfigModule as AppConfigModule } from './config/config.module';
import { CoreModule } from './core/core.module';
import { envSchema } from './config/env/env.validation'
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AppConfigModule,
    CoreModule
  ],
})
export class AppModule { }
