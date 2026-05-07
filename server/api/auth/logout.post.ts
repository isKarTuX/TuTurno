import { db, refreshSessions } from '../../db'
import { eq } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth.utils'
import { success } from '../../utils/response.utils'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const refreshToken = getCookie(event, 'refresh_token')

  if (refreshToken) {
    db.delete(refreshSessions).where(eq(refreshSessions.token, refreshToken)).run()
  }

  deleteCookie(event, 'access_token')
  deleteCookie(event, 'refresh_token')

  return success({ message: 'Sesión cerrada' })
})