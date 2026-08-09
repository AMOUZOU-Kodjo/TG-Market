import redis from '../config/redis.js';

const TIMEOUT_MS = 400;

function withTimeout(promise) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Redis timeout')), TIMEOUT_MS)),
  ]);
}

export async function getOrSetCache(key, ttlSeconds, fetcher) {
  try {
    const cached = await withTimeout(redis.get(key));
    if (cached) return JSON.parse(cached);
  } catch {}

  const data = await fetcher();

  try {
    await withTimeout(redis.set(key, JSON.stringify(data), 'EX', ttlSeconds));
  } catch {}

  return data;
}

export async function invalidateCache(...keys) {
  try {
    if (keys.length > 0) {
      await withTimeout(redis.del(...keys));
    }
  } catch {}
}

export async function invalidateCacheByPattern(pattern) {
  try {
    const keys = await withTimeout(redis.keys(pattern));
    if (keys.length > 0) {
      await withTimeout(redis.del(...keys));
    }
  } catch {}
}
