export const WS_EVENTS = {
  QUEUE_UPDATED: 'QUEUE_UPDATED',
  TURN_CALLED: 'TURN_CALLED',
  YOUR_TURN_SOON: 'YOUR_TURN_SOON',
  YOUR_TURN: 'YOUR_TURN',
  SERVICE_PAUSED: 'SERVICE_PAUSED',
  SERVICE_RESUMED: 'SERVICE_RESUMED',
  OPERATOR_ACTION: 'OPERATOR_ACTION',
} as const

export type WSEvent = typeof WS_EVENTS[keyof typeof WS_EVENTS]

export interface WSMessage<T = any> {
  type: WSEvent
  payload: T
}

export interface QueueUpdatedPayload {
  queue: any[]
  waitingCount: number
  calledTurn: any | null
}

export interface TurnCalledPayload {
  turn: any
  position: number
}

export interface YourTurnPayload {
  turn: any
}

export interface OperatorActionPayload {
  action: 'call_next' | 'complete' | 'no_show'
  serviceId: string
  turnId?: string
}