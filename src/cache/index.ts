import { logger } from "../config/logger"
import { ICache, ICacheProps, ICacheValue } from "../types"

/**
 * The AppCache class is a inMemory cache implementation that provides a simple and efficient way to store and retrieve data.
 * It features key expiration, cache limits, and automatic cleanup.
 */
class AppCache implements ICache {
    private cache: Map<string, ICacheValue>
    private keyExpiration: Map<string, number>
    private limit: number
    private stdTTL: number
    protected checkPeriod: number

    constructor({ checkPeriod, maxKeys, stdTTL }: ICacheProps) {
        this.limit = maxKeys ?? 10
        this.stdTTL = stdTTL ?? 600
        this.checkPeriod = checkPeriod ?? 0
        this.cache = new Map()
        this.keyExpiration = new Map()
    }

    private isExpired(key: string): boolean {
        const expiration = this.keyExpiration.get(key)
        if (expiration === undefined) return false
        return Date.now() > expiration
    }

    protected cleanup(): void {
        const now = Date.now()
        for (const [key, expiration] of this.keyExpiration.entries()) {
            if (now >= expiration) {
                this.cache.delete(key)
                this.keyExpiration.delete(key)
                logger.info(`Expired key: '${key}' removed from cache`)
            }
        }
    }

    protected getCache(): Map<string, ICacheValue> {
        return this.cache
    }

    private getExpiration(ttl: number): number {
        return Date.now() + (ttl * 1000)
    }

    private add(key: string, { value, ttl }: ICacheValue): void {
        const expiration = this.getExpiration(ttl)

        this.cache.set(key, { value, ttl })
        this.keyExpiration.set(key, expiration)
    }

    private delete(key: string): void {
        this.cache.delete(key)
        this.keyExpiration.delete(key)
    }

    /**
     * Retrieves a value from the cache, returning null if the key has expired or doesn't exist.
     * @param key The key to retrieve.
     * @returns The cache entry if found, or null if not.
     */
    private retrieve(key: string): ICacheValue | null {
        if (this.isExpired(key)) {
            this.delete(key)
            return null
        }

        const entry = this.cache.get(key)
        if (!entry) return null

        return entry
    }


    /**
     * Retrieves a list of all keys currently in the cache, removing expired entries before.
     * @returns An array of all keys in the cache.
     */
    listKeys(): string[] {
        this.cleanup()
        return Array.from(this.cache.keys()) as string[]
    }

    /**
     * Retrieves a list of all cache entries currently in the cache, removing expired entries before.
     * @returns An iterator over the entries in the cache.
     */
    listEntries() {
        this.cleanup()
        return this.cache.entries()
    }

    /**
     * Removes all cache entries from the cache.
     */
    flushAll(): void {
        this.cache.clear()
        this.keyExpiration.clear()
    }

    get(key: string): ICacheValue | null {
        return this.retrieve(key)
    }

    /**
     * Retrieves a cache entry and removes it from the cache.
     * @returns The cache entry if it exists, otherwise `null`.
     */
    take(key: string): ICacheValue | null {
        const entry = this.get(key)
        if (entry) {
            this.del(key)
            return entry
        }

        return null
    }

    del(key: string): void {
        this.delete(key)
    }

    /**
     * Adds a cache entry, updating the value and ttl if the key already exists, or deleting the oldest key if the cache is full.
     * @param key The key to add to the cache.
     * @param value The value to associate with the key.
     * @param ttl The time to live for the cache entry in milliseconds.
     */
    set(key: string, value: any, ttl?: number): void {
        const entryTTL = ttl ?? this.stdTTL
        const entryValue = { value, ttl: entryTTL }

        // If the key already exists, update the value and ttl
        if (this.cache.has(key)) {
            this.add(key, entryValue)
            return
        }

        // If the cache is full, delete the oldest key
        if (this.cache.size >= this.limit) {
            const oldestKey = this.cache.keys().next().value
            this.delete(oldestKey)
        }

        this.add(key, entryValue)
    }

    /**
     * Updates the ttl of a cache entry.
     * @param key The key of the cache entry.
     * @param ttl The new ttl in milliseconds.
     * @returns `true` if the cache entry exists, otherwise `false`.
     */
    ttl(key: string, ttl: number): boolean {
        const entry = this.get(key)

        if (entry) {
            this.add(key, { ...entry, ttl })
            this.keyExpiration.set(key, this.getExpiration(ttl))
        }

        // Return true if the entry exists, otherwise false
        return entry !== null || undefined
    }

}

class AutoCleanupCache extends AppCache {
    private cleanupInterval: NodeJS.Timeout

    constructor(props: ICacheProps) {
        super(props)
        this.cleanupInterval = setInterval(() => {
            // If the cache is empty, stop the cleanup
            if (this.getCache().size === 0) {
                this.stopCache()
            }

            // Clean up the cache every checkPeriod seconds
            this.cleanup()
        }, (this.checkPeriod ?? 600) * 1000)
    }

    stopCache() {
        clearInterval(this.cleanupInterval)
    }
}

export { AppCache }

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