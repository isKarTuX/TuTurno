import type { H3Event } from 'h3'
import { verifyAccessToken } from '../utils/jwt.utils'
import { apiError } from '../utils/response.utils'

export async function requireAuth(event: H3Event) {
  const accessToken = getCookie(event, 'access_token')
  
  if (!accessToken) {
    throw apiError('UNAUTHORIZED', 'Token requerido', 401)
  }

  try {
    const payload = await verifyAccessToken(accessToken)
    event.context.user = payload
    return payload
  } catch {
    throw apiError('TOKEN_INVALID', 'Token inválido o expirado', 401)
  }
}