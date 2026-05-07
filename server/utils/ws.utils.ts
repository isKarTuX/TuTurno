interface Peer {
  subscribe: (room: string) => void
  unsubscribe: (room: string) => void
  publish: (room: string, message: string) => void
}

export function broadcastToService(peers: Map<string, Peer>, serviceId: string, message: object) {
  const room = `service:${serviceId}`
  const messageStr = JSON.stringify(message)
  peers.forEach((peer) => {
    peer.publish(room, messageStr)
  })
}

export function broadcastToUser(peers: Map<string, Peer>, userId: string, message: object) {
  const room = `user:${userId}`
  const messageStr = JSON.stringify(message)
  peers.forEach((peer) => {
    peer.publish(room, messageStr)
  })
}

export function broadcastToAll(peers: Map<string, Peer>, message: object) {
  const messageStr = JSON.stringify(message)
  peers.forEach((peer) => {
    peer.publish('*', messageStr)
  })
}