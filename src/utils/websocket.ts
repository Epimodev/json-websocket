import WebSocket from 'ws'
import { ServerOptions } from '../types'

/**
 * Create and start websocket server
 * Return a function which make possible to send messages through the created websocket
 */
function startWsServer({ host, port }: ServerOptions): (message: any) => void {
  const server = new WebSocket.Server({ host, port })

  // define empty function until ws is ready
  let send: (message: any) => void = () => {}

  server.on('connection', ws => {
    send = message => {
      ws.send(message)
    }
  })

  return (message: any) => {
    send(message)
  }
}

export { startWsServer }
