export type UserRole = 'citizen' | 'operator' | 'admin'

export const USER_ROLES = {
  CITIZEN: 'citizen' as const,
  OPERATOR: 'operator' as const,
  ADMIN: 'admin' as const,
}

export const ROLE_LABELS: Record<UserRole, string> = {
  citizen: 'Ciudadano',
  operator: 'Operador',
  admin: 'Administrador',
}

export function hasRole(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole)
}

export function isAdmin(role: UserRole): boolean {
  return role === 'admin'
}

export function isOperator(role: UserRole): boolean {
  return role === 'operator' || role === 'admin'
}