import { useCallback } from "react";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

export function useFastCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 30000, // 30 seconds default
) {
  return useCallback(async (): Promise<T> => {
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
  }, [key, fetcher, ttl]);
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
