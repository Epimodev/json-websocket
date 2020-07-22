import WebSocket from 'ws'
import { ServerOptions } from '../types'

/**
 * Create and start websocket server
 * Return a function which make possible to send messages through the created websocket
 */
function startWsServer({ host, port }: ServerOptions): (message: any) => void {
  const server = new WebSocket.Server({ host, port })
  const clients: WebSocket[] = []

  server.on('connection', ws => {
    clients.push(ws)

    ws.on('close', () => {
      const index = clients.indexOf(ws)
      // remove ws from the list of connected clients
      clients.splice(index, 1)
    })
  })

  return message => {
    for (let i = 0, l = clients.length; i < l; i += 1) {
      clients[i].send(message)
    }
  }
}

export { startWsServer }
