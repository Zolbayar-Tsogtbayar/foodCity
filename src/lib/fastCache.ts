interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

export function createFastCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 1000, // 1 second default
) {
  return async (): Promise<T> => {
    const now = Date.now();
    const cached = cache.get(key);

    if (cached && now - cached.timestamp < cached.ttl) {
      return cached.data as T;
    }

    try {
      const data = await fetcher();
      cache.set(key, { data, timestamp: now, ttl });
      return data;
    } catch (error) {
      if (cached) {
        return cached.data as T; // Return stale cache on error
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
