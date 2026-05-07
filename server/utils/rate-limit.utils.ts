interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

export function checkRateLimit(
  key: string,
  maxRequests: number = 5,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const entry = rateLimitStore.get(key)

  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs
    rateLimitStore.set(key, { count: 1, resetAt })
    return { allowed: true, remaining: maxRequests - 1, resetAt }
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt }
}

export function cleanupExpiredEntries() {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key)
    }
  }
}

setInterval(cleanupExpiredEntries, 60000)

export function getRateLimitKey(event: any): string {
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  return `rate:${ip}`
}