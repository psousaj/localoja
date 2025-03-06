
type ICacheProps = {
    stdTTL?: number // (default: 0) número em segundos pra cada elemento no cache. 0 = ilimitado
    checkPeriod?: number // (default: 600) período em segundos para checar e deletar expired
    maxKeys?: number // (default: 10) // limit for elements maintened in memory
}

type ICacheValue = {
    value: string | object
    ttl?: number
}

interface ICache<K = string, V = ICacheValue> {
    get(key: K): V | null
    set(key: K, value: string | object, ttl?: number): void
    take(key: K): V | null
    del(key: K): void
    ttl(key: K, ttl: number): boolean
    listKeys(): Array<K> | null
    flushAll(): void
}

export { ICache, ICacheValue, ICacheProps }