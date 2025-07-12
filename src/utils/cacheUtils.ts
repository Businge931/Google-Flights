/**
 * Simple in-memory cache implementation for API requests
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class RequestCache {
  private cache: Map<string, CacheItem<unknown>> = new Map();
  private readonly defaultTtl: number = 5 * 60 * 1000; // 5 minutes in milliseconds

  /**
   * Get an item from the cache
   * @param key The cache key
   * @returns The cached value or undefined if not found or expired
   */
  get<T>(key: string): T | undefined {
    const item = this.cache.get(key);
    const now = Date.now();
    
    if (!item) return undefined;
    
    // Check if the cached item has expired
    if (now - item.timestamp > this.defaultTtl) {
      this.cache.delete(key);
      return undefined;
    }
    
    return item.data as T;
  }

  /**
   * Set an item in the cache
   * @param key The cache key
   * @param data The data to cache
   * @param ttl Optional custom time-to-live in milliseconds
   */
  set<T>(key: string, data: T, ttl: number = this.defaultTtl): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });

    // Set up automatic cleanup after TTL
    setTimeout(() => {
      if (this.cache.has(key)) {
        this.cache.delete(key);
      }
    }, ttl);
  }

  /**
   * Check if a key exists in the cache and is not expired
   * @param key The cache key
   * @returns True if the key exists and is not expired
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    const now = Date.now();
    
    if (!item) return false;
    
    // Check if the cached item has expired
    if (now - item.timestamp > this.defaultTtl) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Remove an item from the cache
   * @param key The cache key
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all items from the cache
   */
  clear(): void {
    this.cache.clear();
  }
}

// Export a singleton instance
export const apiCache = new RequestCache();
