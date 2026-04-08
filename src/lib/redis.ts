import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { env, hasRedisConfig } from "./env";

type CacheEntry = {
  value: unknown;
  expiresAt: number;
};

const memoryCache = new Map<string, CacheEntry>();

function readMemoryEntry<T>(key: string): T | null {
  const entry = memoryCache.get(key);

  if (!entry) {
    return null;
  }

  if (entry.expiresAt <= Date.now()) {
    memoryCache.delete(key);
    return null;
  }

  return entry.value as T;
}

function createNoopRatelimit(maxRequests: number) {
  return {
    limit: async () => ({
      success: true,
      limit: maxRequests,
      remaining: maxRequests,
      reset: Date.now() + 60_000,
      pending: Promise.resolve(),
    }),
  };
}

// Upstash Redis — serverless Redis with connection pooling built-in
// In production: set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
export const redis = hasRedisConfig
  ? new Redis({
      url: env.UPSTASH_REDIS_REST_URL!,
      token: env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

// Rate limiters — sliding window algorithm for precision
export const authRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "15 m"),
      analytics: true,
      prefix: "sloerstudio:rl:auth",
    })
  : createNoopRatelimit(10);

export const apiRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, "1 m"),
      analytics: true,
      prefix: "sloerstudio:rl:api",
    })
  : createNoopRatelimit(100);

export const adminRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(200, "1 m"),
      analytics: true,
      prefix: "sloerstudio:rl:admin",
    })
  : createNoopRatelimit(200);

// Cache helpers
export const CACHE_TTL = {
  SHORT: 60,       // 1 min
  MEDIUM: 300,     // 5 min
  LONG: 3600,      // 1 hour
  DAY: 86400,      // 24 hours
} as const;

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    if (!redis) {
      return readMemoryEntry<T>(key);
    }

    const val = await redis.get<T>(key);
    return val;
  } catch {
    return null;
  }
}

export async function cacheSet<T>(key: string, value: T, ttl = CACHE_TTL.MEDIUM): Promise<void> {
  try {
    if (!redis) {
      memoryCache.set(key, { value, expiresAt: Date.now() + ttl * 1000 });
      return;
    }

    await redis.setex(key, ttl, value);
  } catch {
    // Non-blocking — cache miss is acceptable
  }
}

export async function cacheDel(key: string): Promise<void> {
  try {
    if (!redis) {
      memoryCache.delete(key);
      return;
    }

    await redis.del(key);
  } catch {
    // Non-blocking
  }
}
