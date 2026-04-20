interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

export function createFastCache<T, Args extends unknown[]>(
  baseKey: string,
  fetcher: (...args: Args) => Promise<T>,
  ttl: number = 1000, 
) {
  return async (...args: Args): Promise<T> => {
    const fullKey = args.length > 0 ? `${baseKey}:${JSON.stringify(args)}` : baseKey;
    const now = Date.now();
    const cached = cache.get(fullKey);

    if (cached && now - cached.timestamp < cached.ttl) {
      return cached.data as T;
    }

    try {
      const data = await fetcher(...args);
      cache.set(fullKey, { data, timestamp: now, ttl });
      return data;
    } catch (error) {
      if (cached) {
        return cached.data as T;
      }
      throw error;
    }
  };
}

export function clearCache(pattern?: string) {
  if (pattern) {
    for (const [key] of cache) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  } else {
    cache.clear();
  }
}
