import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Upstash Redis — serverless Redis with connection pooling built-in
// In production: set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL ?? "http://localhost:6379",
  token: process.env.UPSTASH_REDIS_REST_TOKEN ?? "dev-token",
});

// Rate limiters — sliding window algorithm for precision
export const authRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "15 m"),
  analytics: true,
  prefix: "sloerstudio:rl:auth",
});

export const apiRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"),
  analytics: true,
  prefix: "sloerstudio:rl:api",
});

export const adminRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(200, "1 m"),
  analytics: true,
  prefix: "sloerstudio:rl:admin",
});

// Cache helpers
export const CACHE_TTL = {
  SHORT: 60,       // 1 min
  MEDIUM: 300,     // 5 min
  LONG: 3600,      // 1 hour
  DAY: 86400,      // 24 hours
} as const;

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const val = await redis.get<T>(key);
    return val;
  } catch {
    return null;
  }
}

export async function cacheSet<T>(key: string, value: T, ttl = CACHE_TTL.MEDIUM): Promise<void> {
  try {
    await redis.setex(key, ttl, value);
  } catch {
    // Non-blocking — cache miss is acceptable
  }
}

export async function cacheDel(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch {
    // Non-blocking
  }
}
