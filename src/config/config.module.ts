import { Module } from '@nestjs/common';
import { EnvService } from './env/env.service';
import { EnvModule } from './env/env.module';

@Module({
  providers: [EnvService],
  imports: [EnvModule]
})
export class ConfigModule {}
