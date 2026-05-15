import { defineEventHandler, getRequestURL } from 'h3'
import { verifyAccessToken } from '../utils/jwt.utils'

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  const publicPaths = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/refresh',
    '/api/entities',
    '/api/services',
    '/api/turns/public',
    '/api/turns/by-document',
    '/api/turns/track',
  ]
  if (publicPaths.some(p => path.startsWith(p))) {
    return
  }

  if (!path.startsWith('/api/')) {
    return
  }

  const accessToken = getCookie(event, 'access_token')
  if (!accessToken) {
    throw createError({
      statusCode: 401,
      data: { success: false, error: { code: 'UNAUTHORIZED', message: 'Token requerido' } }
    })
  }

  try {
    const payload = await verifyAccessToken(accessToken)
    event.context.user = payload
  } catch {
    throw createError({
      statusCode: 401,
      data: { success: false, error: { code: 'TOKEN_INVALID', message: 'Token inválido o expirado' } }
    })
  }
})