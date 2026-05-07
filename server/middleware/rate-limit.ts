import { defineEventHandler, getRequestURL } from 'h3'
import { checkRateLimit, getRateLimitKey } from '../utils/rate-limit.utils'

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  const rateLimitedPaths = ['/api/auth/login', '/api/auth/register']
  if (!rateLimitedPaths.some(p => path.startsWith(p))) {
    return
  }

  if (!path.startsWith('/api/')) {
    return
  }

  const key = getRateLimitKey(event)
  const result = checkRateLimit(key, 5, 60000)

  event.node.res.setHeader('X-RateLimit-Limit', '5')
  event.node.res.setHeader('X-RateLimit-Remaining', String(result.remaining))
  event.node.res.setHeader('X-RateLimit-Reset', String(result.resetAt))

  if (!result.allowed) {
    const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000)
    event.node.res.setHeader('Retry-After', String(retryAfter))
    throw createError({
      statusCode: 429,
      data: {
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Demasiadas solicitudes. Por favor intenta más tarde.',
        },
      },
    })
  }
})