import { db, turns } from '../../db'
import { eq, desc } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth.utils'
import { success } from '../../utils/response.utils'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const authUser = event.context.user as { sub: string; role: string; email: string }

  const userTurns = db.select().from(turns)
    .where(eq(turns.citizenId, authUser.sub))
    .orderBy(desc(turns.createdAt))
    .all()

  return success(userTurns)
})