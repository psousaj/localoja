import { Inject, Injectable } from '@nestjs/common';
// import NodeCache from 'node-cache';
import * as NodeCache from 'node-cache';
import { AppLogger } from '../logger/app-logger.service';

@Injectable()
export class CacheService {
    private cache: NodeCache;

    constructor(
        @Inject(AppLogger)
        private readonly logger: AppLogger
    ) {
        this.cache = new NodeCache({
            maxKeys: 100,
            stdTTL: 600, // 10 minutes
            checkperiod: 120, // 2 minutes
            useClones: false,
        });
    }

    private evictIfNeeded() {
        const keys = this.cache.keys();
        if (keys.length >= this.cache.options.maxKeys!) {
            const oldestKey = keys[0];
            this.cache.del(oldestKey);
            this.logger.info(`[CACHE] Evicted oldest key: '${oldestKey}' due to cache size limit`);
        }
    }

    set<T>(key: string, value: T, ttl?: number): void {
        this.evictIfNeeded();
        const success = this.cache.set(key, value, ttl ?? (this.cache.options.stdTTL as number));
        if (success) {
            this.logger.info(`[CACHE] Added key: '${key}' to cache${ttl ? ` with TTL: ${ttl}` : ''}`);
        } else {
            this.logger.warn(`[CACHE] Failed to add key: '${key}' to cache`);
        }
    }

    get<T>(key: string): T | null {
        const value = this.cache.get<T>(key);
        if (value === undefined) {
            this.logger.info(`[CACHE] Miss: '${key}' not found or expired`);
            return null;
        }
        this.logger.info(`[CACHE] Hit: '${key}' retrieved successfully`);
        return value;
    }

    take<T>(key: string): T | null {
        const value = this.get<T>(key);
        if (value !== null) {
            this.del(key);
        }
        return value;
    }

    del(key: string): void {
        const deleted = this.cache.del(key);
        if (deleted > 0) {
            this.logger.info(`[CACHE] Deleted key: '${key}' from cache`);
        } else {
            this.logger.info(`[CACHE] Delete attempt: '${key}' not found in cache`);
        }
    }

    flushAll(): void {
        this.cache.flushAll();
        this.logger.info('[CACHE] Cache flushed');
    }

    ttl(key: string, ttl: number): boolean {
        const success = this.cache.ttl(key, ttl);
        if (success) {
            this.logger.info(`[CACHE] Updated TTL for key: '${key}' to ${ttl}`);
        } else {
            this.logger.info(`[CACHE] TTL update failed: '${key}' not found`);
        }
        return success;
    }

    listKeys(): string[] {
        return this.cache.keys();
    }

    listEntries(): [string, any][] {
        return this.cache.keys().map(key => [key, this.cache.get(key)]);
    }
}
