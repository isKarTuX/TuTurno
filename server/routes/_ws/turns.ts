import { db, turns, services } from '../../db'
import { eq, and, asc } from 'drizzle-orm'
import { WS_EVENTS } from '../../../constants/ws.constants'
import { notifyTurnCalled, notifyTurnSoon } from '../../utils/push.utils'

export default defineWebSocketHandler({
  open(peer) {
    const url = peer.request?.url || ''
    const serviceId = new URL(url, 'http://localhost').searchParams.get('serviceId')
    const userId = new URL(url, 'http://localhost').searchParams.get('userId')

    if (serviceId) {
      peer.subscribe(`service:${serviceId}`)
    }
    if (userId) {
      peer.subscribe(`user:${userId}`)
    }
  },

  message(peer, message) {
    try {
      const data = JSON.parse(message.text())
      const { type, payload } = data

      if (type === WS_EVENTS.OPERATOR_ACTION) {
        handleOperatorAction(peer, payload)
      }
    } catch (error) {
      console.error('WebSocket message error:', error)
    }
  },

  close(peer) {
    peer.unsubscribe('service:*')
    peer.unsubscribe('user:*')
  },
})

async function handleOperatorAction(peer: { publish: (topic: string, message: string) => void; subscribe: (topic: string) => void }, payload: { action: string; serviceId: string; turnId?: string }) {
  const { action, serviceId, turnId } = payload

  if (action === 'call_next') {
    const waitingQueue = db.select().from(turns)
      .where(and(eq(turns.serviceId, serviceId), eq(turns.status, 'waiting')))
      .orderBy(asc(turns.queuePosition))
      .all()

    if (waitingQueue.length === 0) {
      peer.publish(`service:${serviceId}`, JSON.stringify({
        type: WS_EVENTS.QUEUE_UPDATED,
        payload: { queue: [], waitingCount: 0, calledTurn: null },
      }))
      return
    }

    const nextTurn = waitingQueue[0]
    db.update(turns).set({ status: 'called', calledAt: new Date() })
      .where(eq(turns.id, nextTurn.id))
      .run()

    const updatedTurn = db.select().from(turns).where(eq(turns.id, nextTurn.id)).get()
    const service = db.select().from(services).where(eq(services.id, serviceId)).get()

    const newQueue = db.select().from(turns)
      .where(and(eq(turns.serviceId, serviceId), eq(turns.status, 'waiting')))
      .orderBy(asc(turns.queuePosition))
      .all()

    peer.publish(`service:${serviceId}`, JSON.stringify({
      type: WS_EVENTS.QUEUE_UPDATED,
      payload: {
        queue: newQueue,
        waitingCount: newQueue.length,
        calledTurn: updatedTurn,
      },
    }))

    peer.publish(`user:${nextTurn.citizenId}`, JSON.stringify({
      type: WS_EVENTS.TURN_CALLED,
      payload: { turn: updatedTurn, position: newQueue.length + 1 },
    }))

    if (updatedTurn && service && nextTurn.citizenId) {
      notifyTurnCalled(nextTurn.citizenId, updatedTurn.turnNumber, service.name)
    }

    if (newQueue.length > 0 && newQueue.length <= 3) {
      const turnSoon = newQueue[0]
      if (turnSoon.citizenId) {
        notifyTurnSoon(turnSoon.citizenId, newQueue.length, turnSoon.turnNumber)
      }
    }
  }

  if (action === 'complete' && turnId) {
    db.update(turns).set({ status: 'completed', completedAt: new Date() })
      .where(eq(turns.id, turnId))
      .run()

    const newQueue = db.select().from(turns)
      .where(and(eq(turns.serviceId, serviceId), eq(turns.status, 'waiting')))
      .orderBy(asc(turns.queuePosition))
      .all()

    peer.publish(`service:${serviceId}`, JSON.stringify({
      type: WS_EVENTS.QUEUE_UPDATED,
      payload: {
        queue: newQueue,
        waitingCount: newQueue.length,
        calledTurn: null,
      },
    }))
  }

  if (action === 'no_show' && turnId) {
    db.update(turns).set({ status: 'no_show' })
      .where(eq(turns.id, turnId))
      .run()

    const newQueue = db.select().from(turns)
      .where(and(eq(turns.serviceId, serviceId), eq(turns.status, 'waiting')))
      .orderBy(asc(turns.queuePosition))
      .all()

    peer.publish(`service:${serviceId}`, JSON.stringify({
      type: WS_EVENTS.QUEUE_UPDATED,
      payload: {
        queue: newQueue,
        waitingCount: newQueue.length,
        calledTurn: null,
      },
    }))
  }

  if (action === 'pause' || action === 'resume') {
    const isPaused = action === 'pause'
    db.update(services).set({ isPaused })
      .where(eq(services.id, serviceId))
      .run()

    const wsEvent = isPaused ? WS_EVENTS.SERVICE_PAUSED : WS_EVENTS.SERVICE_RESUMED
    peer.publish(`service:${serviceId}`, JSON.stringify({
      type: wsEvent,
      payload: { serviceId },
    }))
  }
}