import type { TurnStatus } from '~/types'

export const TURN_STATUS = {
  WAITING: 'waiting' as const,
  CALLED: 'called' as const,
  ATTENDING: 'attending' as const,
  COMPLETED: 'completed' as const,
  NO_SHOW: 'no_show' as const,
  CANCELLED: 'cancelled' as const,
}

export const TURN_STATUS_LABELS: Record<TurnStatus, string> = {
  waiting: 'En espera',
  called: 'Llamado',
  attending: 'En atención',
  completed: 'Completado',
  no_show: 'No asistido',
  cancelled: 'Cancelado',
}

export const TURN_STATUS_COLORS: Record<TurnStatus, string> = {
  waiting: 'var(--turn-waiting)',
  called: 'var(--turn-called)',
  attending: 'var(--turn-attending)',
  completed: 'var(--turn-completed)',
  no_show: 'var(--turn-no-show)',
  cancelled: 'var(--turn-cancelled)',
}

export const MAX_TURNS_PER_USER_PER_DAY = 5

export const TURNS_BEFORE_NOTIFICATION = 3

export function formatTurnNumber(prefix: string, number: number): string {
  return `${prefix}-${String(number).padStart(3, '0')}`
}

export function parseTurnNumber(turnNumber: string): { prefix: string; number: number } | null {
  const match = turnNumber.match(/^([A-Za-z])-(\d+)$/)
  if (!match) return null
  return {
    prefix: match[1].toUpperCase(),
    number: parseInt(match[2], 10),
  }
}