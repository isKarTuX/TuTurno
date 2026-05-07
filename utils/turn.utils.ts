import type { Turn } from '~/types'
import { TURN_STATUS_LABELS } from '~/constants/turn.constants'

export function getTurnDisplayNumber(turnNumber: string): string {
  return turnNumber
}

export function getTurnStatusLabel(status: Turn['status']): string {
  return TURN_STATUS_LABELS[status] || status
}

export function isTurnCancellable(turn: Turn): boolean {
  return turn.status === 'waiting'
}

export function isTurnActive(turn: Turn): boolean {
  return ['waiting', 'called', 'attending'].includes(turn.status)
}

export function getTurnEstimatedWaitTime(_turn: Turn, avgAttentionTime: number, positionAhead: number): number {
  return positionAhead * avgAttentionTime
}