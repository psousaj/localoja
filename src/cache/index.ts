import { ICache, ICacheProps, ICacheValue } from "../types";

class AppCache implements ICache {
    private cache: Map<string, ICacheValue>
    private keyExpiration: Map<string, number>
    private limit: number
    private stdTTL: number
    protected checkPeriod: number

    constructor({ checkPeriod, maxKeys, stdTTL }: ICacheProps) {
        this.limit = maxKeys ?? 9
        this.stdTTL = stdTTL ?? 0
        this.checkPeriod = checkPeriod ?? 600
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
            }
        }
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

    private retrieve(key: string): ICacheValue | null {
        if (this.isExpired(key)) {
            this.delete(key)
            return null
        }

        const entry = this.cache.get(key)
        if (!entry) return null

        return entry
    }

    listKeys(): string[] {
        this.cleanup()
        return Array.from(this.cache.keys()) as string[]
    }

    listEntries() {
        this.cleanup();
        return this.cache.entries()
    }

    flushAll(): void {
        this.cache.clear()
        this.keyExpiration.clear()
    }

    get(key: string): ICacheValue | null {
        return this.retrieve(key)
    }

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

    set(key: string, value: any, ttl?: number): void {
        const entryTTL = ttl ?? this.stdTTL
        const entryValue = { value, ttl: entryTTL }

        if (this.cache.has(key)) {
            this.add(key, entryValue)
            return
        }

        if (this.cache.size >= this.limit) {
            const oldestKey = this.cache.keys().next().value
            this.delete(oldestKey)
        }

        this.add(key, entryValue)
    }

    ttl(key: string, ttl: number): boolean {
        const entry = this.get(key)

        if (!entry) return false

        console.log("DEBUG", ttl, entry)
        this.add(key, { ...entry, ttl })
        this.keyExpiration.set(key, this.getExpiration(ttl))

        return true
    }

}

class AutoCleanupCache extends AppCache {
    private cleanupInterval: NodeJS.Timeout

    constructor(props: ICacheProps) {
        super(props)
        this.cleanupInterval = setInterval(() => this.cleanup(), (this.checkPeriod ?? 600) * 1000)
    }

    stopCache() {
        clearInterval(this.cleanupInterval);
    }
}

export { AppCache }

// const cache = new AutoCleanupCache({ maxKeys: 2, stdTTL: 100, checkPeriod: 5 })
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
//     .then(() => console.log("Passaram 5 segundos!"))
//     .then(
//         () => { console.log(); cache.set('5', 5, 1); console.log("CLEAN", cache.listKeys()) }
//     )
// cache.set('4', '4')
// console.log(cache.listEntries())