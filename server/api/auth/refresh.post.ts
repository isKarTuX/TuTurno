import { db, refreshSessions, users } from '../../db'
import { eq, and, gt } from 'drizzle-orm'
import { signAccessToken } from '../../utils/jwt.utils'
import { success, apiError } from '../../utils/response.utils'

export default defineEventHandler(async (event) => {
  const oldRefreshToken = getCookie(event, 'refresh_token')

  if (!oldRefreshToken) {
    throw apiError('SESSION_EXPIRED', 'La sesión ha expirado', 401)
  }

  const session = db.select().from(refreshSessions)
    .where(and(
      eq(refreshSessions.token, oldRefreshToken),
      gt(refreshSessions.expiresAt, new Date())
    ))
    .get()

  if (!session) {
    db.delete(refreshSessions).where(eq(refreshSessions.token, oldRefreshToken)).run()
    throw apiError('SESSION_EXPIRED', 'La sesión ha expirado', 401)
  }

  const user = db.select().from(users).where(eq(users.id, session.userId)).get()
  if (!user) {
    db.delete(refreshSessions).where(eq(refreshSessions.id, session.id)).run()
    throw apiError('USER_NOT_FOUND', 'Usuario no encontrado', 404)
  }

  db.delete(refreshSessions).where(eq(refreshSessions.id, session.id)).run()

  const newRefreshToken = crypto.randomUUID()
  const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  db.insert(refreshSessions).values({
    id: crypto.randomUUID(),
    userId: user.id,
    token: newRefreshToken,
    expiresAt: newExpiresAt,
  }).run()

  const accessToken = await signAccessToken({
    sub: user.id,
    role: user.role as 'citizen' | 'operator' | 'admin',
    email: user.email,
  })

  deleteCookie(event, 'access_token')
  deleteCookie(event, 'refresh_token')

  setCookie(event, 'refresh_token', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  setCookie(event, 'access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 15,
    path: '/',
  })

  return success({ accessToken, refreshToken: newRefreshToken })
})