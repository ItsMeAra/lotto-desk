type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 30;
const MAX_KEYS = 5000;

export function rateLimitKey(ip: string, route: string): string {
  return `${route}:${ip}`;
}

function pruneExpiredBuckets(now: number) {
  if (buckets.size <= MAX_KEYS) return;
  for (const [k, v] of buckets) {
    if (now >= v.resetAt) buckets.delete(k);
  }
  if (buckets.size > MAX_KEYS) {
    const keys = [...buckets.keys()].slice(0, buckets.size - MAX_KEYS + 500);
    keys.forEach((k) => buckets.delete(k));
  }
}

export function checkRateLimit(key: string): { ok: boolean; retryAfterSec?: number } {
  const now = Date.now();
  pruneExpiredBuckets(now);
  let b = buckets.get(key);
  if (!b || now >= b.resetAt) {
    b = { count: 1, resetAt: now + WINDOW_MS };
    buckets.set(key, b);
    return { ok: true };
  }
  if (b.count >= MAX_PER_WINDOW) {
    return { ok: false, retryAfterSec: Math.ceil((b.resetAt - now) / 1000) };
  }
  b.count += 1;
  return { ok: true };
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  const real = headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}
