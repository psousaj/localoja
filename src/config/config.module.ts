import { Module } from '@nestjs/common';
import { EnvService } from './env/env.service';
import { EnvModule } from './env/env.module';
import { LoggerModule } from '../core/logger/logger.module';

@Module({
  providers: [EnvService],
  imports: [EnvModule, LoggerModule]
})
export class ConfigModule { }
