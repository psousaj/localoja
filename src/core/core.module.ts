import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { CacheService } from './cache/cache.service';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [DatabaseModule, LoggerModule],
  providers: [CacheService],
  exports: [LoggerModule]
})
export class CoreModule { }
