const http = require('http')
const express = require('express')
const cors = require('cors')
const { Server } = require('socket.io')

const port = process.env.PORT || 4001

const app = express()

const allowedOrigins = ['http://localhost:3000']
app.use(
  cors({
    origin: allowedOrigins,
  })
)

app.use('/', (req, res) => {
  return res.json({ hello: 'world' })
})

const server = http.createServer(app)

const io = new Server(server, {
  path: '/signalling-server/',
  cors: {
    origin: allowedOrigins,
  },
})

let interval

const connectedUsers = {}

io.on('connection', (socket) => {
  connectedUsers[socket.id] = {
    id: socket.id,
  }
  console.log(1, connectedUsers)

  socket.on('disconnect', () => {
    console.log('2 disconnected', socket.id)
    delete connectedUsers[socket.id]

    console.log(3, connectedUsers)

    clearInterval(interval)
  })
})

server.listen(port, () => console.log(`Listening on http://localhost:${port}`))
