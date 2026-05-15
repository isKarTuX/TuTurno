import { db, users, refreshSessions } from '../../db'
import { eq } from 'drizzle-orm'
import { loginSchema } from '../../../schemas/auth.schema'
import { verifyPassword } from '../../utils/hash.utils'
import { signAccessToken } from '../../utils/jwt.utils'
import { success, apiError } from '../../utils/response.utils'
import type { UserResponse } from '~/types'

export default defineEventHandler(async (event) => {
  let body: { email: string; password: string }
  try {
    body = await readBody(event)
  } catch {
    throw apiError('VALIDATION_ERROR', 'Invalid JSON body', 400)
  }

  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    throw apiError('VALIDATION_ERROR', 'Datos inválidos', 400)
  }

  const user = db.select().from(users).where(eq(users.email, parsed.data.email)).get()
  if (!user) {
    throw apiError('INVALID_CREDENTIALS', 'Email o contraseña incorrectos', 401)
  }

  const isValidPassword = await verifyPassword(parsed.data.password, user.passwordHash)
  if (!isValidPassword) {
    throw apiError('INVALID_CREDENTIALS', 'Email o contraseña incorrectos', 401)
  }

  const accessToken = await signAccessToken({
    sub: user.id,
    role: String(user.role) as 'citizen' | 'operator' | 'admin',
    email: user.email,
  })

  const refreshToken = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  db.insert(refreshSessions).values({
    id: crypto.randomUUID(),
    userId: user.id,
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

  const userResponse: UserResponse = {
    id: user.id,
    fullName: user.fullName,
    documentId: user.documentId,
    email: user.email,
    phone: user.phone,
    role: String(user.role) as 'citizen' | 'operator' | 'admin',
    isActive: Boolean(user.isActive),
    mustChangePassword: Boolean(user.mustChangePassword),
    createdAt: user.createdAt ?? new Date(),
    updatedAt: user.updatedAt ?? new Date(),
  }

  return success({ user: userResponse, mustChangePassword: Boolean(user.mustChangePassword) })
})