import { db, users, turns, entities, services, refreshSessions } from '../../db'
import { eq, and, inArray } from 'drizzle-orm'
import { z } from 'zod'
import { hashPassword } from '../../utils/hash.utils'
import { signAccessToken } from '../../utils/jwt.utils'
import { success, apiError } from '../../utils/response.utils'

const registerSimpleSchema = z.object({
  documentId: z.string().min(5).max(20),
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  phone: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, registerSimpleSchema.parse)

  const existingUser = db.select().from(users).where(eq(users.documentId, body.documentId)).get()
  if (existingUser) {
    throw apiError('CONFLICT', 'Ya existe un usuario con este número de cédula', 409)
  }

  const existingEmail = db.select().from(users).where(eq(users.email, body.email)).get()
  if (existingEmail) {
    throw apiError('CONFLICT', 'Ya existe un usuario con este correo electrónico', 409)
  }

  const passwordHash = await hashPassword(body.password)

  const userId = crypto.randomUUID()

  db.insert(users).values({
    id: userId,
    fullName: body.fullName,
    documentId: body.documentId,
    email: body.email,
    phone: body.phone ?? '',
    passwordHash,
    role: 'citizen',
    isActive: true,
  }).run()

  const activeStatuses = ['waiting', 'called', 'attending'] as const

  const unclaimedTurns = db.select({
    turn: turns,
    entity: entities,
    service: services,
  })
    .from(turns)
    .leftJoin(entities, eq(turns.entityId, entities.id))
    .leftJoin(services, eq(turns.serviceId, services.id))
    .where(
      and(
        eq(turns.citizenId, userId),
        inArray(turns.status, [...activeStatuses])
      )
    )
    .all()

  const accessToken = await signAccessToken({
    sub: userId,
    role: 'citizen',
    email: body.email,
  })

  const refreshToken = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  db.insert(refreshSessions).values({
    id: crypto.randomUUID(),
    userId,
    token: refreshToken,
    expiresAt,
  }).run()

  deleteCookie(event, 'access_token')
  deleteCookie(event, 'refresh_token')

  setCookie(event, 'access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 15,
    path: '/',
  })

  setCookie(event, 'refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return success({
    user: {
      id: userId,
      fullName: body.fullName,
      documentId: body.documentId,
      email: body.email,
      role: 'citizen',
    },
    turns: unclaimedTurns.map(row => ({
      ...row.turn,
      entity: row.entity,
      service: row.service,
    })),
  })
})