import { io } from 'socket.io-client'

// We create ONE socket instance and reuse it across the app.
// If we created a new socket in every component, we'd have multiple
// connections open — wasteful and causes duplicate events.
const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
  autoConnect: false, // Don't connect until we explicitly call socket.connect()
})

export default socket
