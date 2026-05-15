import { db, users } from '../../db'
import { eq, and } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth.utils'
import { success, apiError } from '../../utils/response.utils'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const authUser = event.context.user as { role: string; sub: string }
  if (authUser.role !== 'operator' && authUser.role !== 'admin') {
    throw apiError('FORBIDDEN', 'Acceso denegado', 403)
  }

  const query = getQuery(event)
  const search = (query.search as string) || ''
  const incompleteOnly = query.incomplete === 'true'

  let allCitizens
  if (incompleteOnly) {
    allCitizens = db.select({
      id: users.id,
      fullName: users.fullName,
      documentId: users.documentId,
      email: users.email,
      phone: users.phone,
      role: users.role,
      isActive: users.isActive,
      mustChangePassword: users.mustChangePassword,
      createdAt: users.createdAt,
    })
      .from(users)
      .where(and(
        eq(users.role, 'citizen'),
        eq(users.mustChangePassword, true)
      ))
      .all()
  } else {
    allCitizens = db.select({
      id: users.id,
      fullName: users.fullName,
      documentId: users.documentId,
      email: users.email,
      phone: users.phone,
      role: users.role,
      isActive: users.isActive,
      mustChangePassword: users.mustChangePassword,
      createdAt: users.createdAt,
    })
      .from(users)
      .where(eq(users.role, 'citizen'))
      .all()
  }

  const filteredCitizens = search
    ? allCitizens.filter(c =>
        c.fullName.toLowerCase().includes(search.toLowerCase()) ||
        c.documentId.includes(search) ||
        c.email.toLowerCase().includes(search.toLowerCase())
      )
    : allCitizens

  return success({
    citizens: filteredCitizens.map(c => ({
      ...c,
      isActive: Boolean(c.isActive),
      mustChangePassword: Boolean(c.mustChangePassword),
      isIncomplete: c.email.endsWith('@pending.tuturno') || c.mustChangePassword === true,
    })),
    total: filteredCitizens.length,
  })
})