const windowMs = 60 * 1000;
const maxRequests = 20;
const ipBuckets = new Map<string, { count: number; expiresAt: number }>();

export function rateLimit(ip: string): boolean {
  const now = Date.now();
  const bucket = ipBuckets.get(ip);
  if (!bucket || bucket.expiresAt < now) {
    ipBuckets.set(ip, { count: 1, expiresAt: now + windowMs });
    return true;
  }
  if (bucket.count >= maxRequests) return false;
  bucket.count += 1;
  return true;
}
