"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppCache = void 0;
const logger_1 = require("../config/logger");
/**
 * The AppCache class is a inMemory cache implementation that provides a simple and efficient way to store and retrieve data.
 * It features key expiration, cache limits, and automatic cleanup.
 */
class AppCache {
    constructor({ checkPeriod, maxKeys, stdTTL }) {
        this.limit = maxKeys ?? 10;
        this.stdTTL = stdTTL ?? 600;
        this.checkPeriod = checkPeriod ?? 0;
        this.cache = new Map();
        this.keyExpiration = new Map();
    }
    static getInstance(props) {
        if (!AppCache.instance) {
            if (!props)
                throw new Error("AppCache needs properties on first initialization");
            AppCache.instance = new AppCache(props);
        }
        return AppCache.instance;
    }
    isExpired(key) {
        const expiration = this.keyExpiration.get(key);
        if (expiration === undefined)
            return false;
        return Date.now() > expiration;
    }
    /**
     * Periodically removes expired keys from the cache and from the expiration map.
     * The cleanup is done by iterating over the expiration map and deleting any keys
     * that have an expiration date in the past.
     */
    cleanup() {
        const now = Date.now();
        for (const [key, expiration] of this.keyExpiration.entries()) {
            if (now >= expiration) {
                this.cache.delete(key);
                this.keyExpiration.delete(key);
                logger_1.logger.info(`Expired key: '${key}' removed from cache`);
            }
        }
    }
    getCache() {
        return this.cache;
    }
    getExpiration(ttl) {
        return Date.now() + (ttl * 1000);
    }
    add(key, { value, ttl }) {
        const expiration = this.getExpiration(ttl);
        this.cache.set(key, { value, ttl });
        this.keyExpiration.set(key, expiration);
        logger_1.logger.info(`Added key: '${key}' to cache with TTL: ${ttl}`);
    }
    delete(key) {
        this.cache.delete(key);
        this.keyExpiration.delete(key);
        logger_1.logger.info(`Deleted key: '${key}' from cache`);
    }
    /**
     * Retrieves a value from the cache, returning null if the key has expired or doesn't exist.
     * @param key The key to retrieve.
     * @returns The cache entry if found, or null if not.
     */
    retrieve(key) {
        if (this.isExpired(key)) {
            logger_1.logger.info(`Cache miss: '${key}' expired and removed`);
            this.delete(key);
            return null;
        }
        const entry = this.cache.get(key);
        if (!entry) {
            logger_1.logger.info(`Cache miss: '${key}' not found`);
            return null;
        }
        logger_1.logger.info(`Cache hit: '${key}' retrieved successfully`);
        return entry;
    }
    /**
     * Retrieves a list of all keys currently in the cache, removing expired entries before.
     * @returns An array of all keys in the cache.
     */
    listKeys() {
        this.cleanup();
        return Array.from(this.cache.keys());
    }
    /**
     * Retrieves a list of all cache entries currently in the cache, removing expired entries before.
     * @returns An iterator over the entries in the cache.
     */
    listEntries() {
        this.cleanup();
        return this.cache.entries();
    }
    /**
     * Removes all cache entries from the cache.
     */
    flushAll() {
        this.cache.clear();
        this.keyExpiration.clear();
        logger_1.logger.info("Cache flushed");
    }
    /**
     * Retrieves a value from the cache, returning null if the key has expired or doesn't exist.
     * @param key The key to retrieve.
     * @returns The cache entry if found, or null if not.
     */
    get(key) {
        return this.retrieve(key).value;
    }
    /**
     * Retrieves a cache entry and removes it from the cache.
     * @returns The cache entry if it exists, otherwise `null`.
     */
    take(key) {
        const entry = this.get(key);
        if (entry) {
            this.del(key);
            return entry;
        }
        return null;
    }
    del(key) {
        this.delete(key);
    }
    /**
     * Adds a cache entry, updating the value and ttl if the key already exists, or deleting the oldest key if the cache is full.
     * @param key The key to add to the cache.
     * @param value The value to associate with the key.
     * @param ttl The time to live for the cache entry in milliseconds.
     */
    set(key, value, ttl) {
        const entryTTL = ttl ?? this.stdTTL;
        const entryValue = { value, ttl: entryTTL };
        // If the key already exists, update the value and ttl
        if (this.cache.has(key)) {
            this.add(key, entryValue);
            return;
        }
        // If the cache is full, delete the oldest key
        if (this.cache.size >= this.limit) {
            const oldestKey = this.cache.keys().next().value;
            this.delete(oldestKey);
        }
        this.add(key, entryValue);
    }
    /**
     * Updates the ttl of a cache entry.
     * @param key The key of the cache entry.
     * @param ttl The new ttl in milliseconds.
     * @returns `true` if the cache entry exists, otherwise `false`.
     */
    ttl(key, ttl) {
        const entry = this.get(key);
        if (entry) {
            this.add(key, { ...entry, ttl });
            this.keyExpiration.set(key, this.getExpiration(ttl));
            logger_1.logger.info(`Updated TTL for key: '${key}' to ${ttl}`);
            return true;
        }
        return false;
    }
}
exports.AppCache = AppCache;
// const cache = new AppCache({ maxKeys: 2, stdTTL: 5, checkPeriod: 5 })
// cache.set("1", "primeiro valor")
// cache.set("2", "segundo valor")
// console.log(cache.listEntries())
// console.log()
// cache.set("1", "Mudei o valor do 1")
// cache.ttl("1", 5)
// console.log(cache.listEntries())
// console.log()
// cache.set("3", "terceiro valor que apaga o primeiro")
// console.log("KEYS", cache.listKeys())
// console.log("ENTRIES", cache.listEntries())
// console.log()
// cache.del("2")
// console.log("KEYS", cache.listKeys())
// cache.ttl("3", 5)
// Promise.resolve()
//     .then(() => new Promise((resolve) => setTimeout(resolve, 7000)))
//     .then(() => console.log("Passaram 7 segundos!"))
//     .then(
//         () => { console.log() cache.set('5', 5, 1) console.log("CLEAN", cache.listKeys()) }
//     )
// cache.set('4', '4')
// console.log(cache.listEntries())
//# sourceMappingURL=index.js.map