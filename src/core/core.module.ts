import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { LoggerService } from './logger/logger.service';
import { CacheService } from './cache/cache.service';

@Module({
  imports: [DatabaseModule],
  providers: [LoggerService, CacheService]
})
export class CoreModule { }
