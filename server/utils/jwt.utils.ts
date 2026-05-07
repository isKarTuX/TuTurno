import { SignJWT, jwtVerify, type JWTPayload as JoseJWTPayload } from 'jose'

const getJwtSecret = () => new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-key-min-32-chars-change-this')

export interface JWTPayload extends JoseJWTPayload {
  sub: string
  role: 'citizen' | 'operator' | 'admin'
  email: string
}

export async function signAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  return new SignJWT(payload as JoseJWTPayload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(getJwtSecret())
}

export async function verifyAccessToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, getJwtSecret(), { algorithms: ['HS256'] })
  return payload as JWTPayload
}