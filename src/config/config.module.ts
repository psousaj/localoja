import { Module } from '@nestjs/common';
import { EnvService } from './env/env.service';

@Module({
  providers: [EnvService]
})
export class ConfigModule {}
