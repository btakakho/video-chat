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

io.on('connection', (socket) => {
  console.log('New client connected', socket.id)

  socket.on('disconnect', () => {
    console.log(`Client #${socket.id} disconnected`)
    clearInterval(interval)
  })
})

server.listen(port, () => console.log(`Listening on http://localhost:${port}`))
