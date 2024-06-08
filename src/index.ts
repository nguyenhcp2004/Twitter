import express from 'express'
import databaseService from './services/database.service'
import { usersRoutes } from './routes/users.routes'
import { defaultErrorHandler } from './middlewares/error.middleware'
import { mediasRoutes } from './routes/medias.routes'
import { initFolder } from './utils/file'
import { config } from 'dotenv'
import { UPLOAD_VIDEO_DIR } from './constants/dir'
import { staticRoutes } from './routes/static.routes'
import cors from 'cors'
import tweetsRouters from './routes/tweets.routes'
import bookmarksRouters from './routes/bookmarks.routes'
import likesRouters from './routes/likes.routes'
import searchRouter from './routes/search.routes'
import { createServer } from 'http'
import { Server } from 'socket.io'
import Conversation from './models/schemas/Conversations.schema'
import { ObjectId } from 'mongodb'
import conversationsRouter from './routes/conversations.routes'

config()
databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexRefreshTokens()
  databaseService.indexVideoStatus()
  databaseService.indexFollowers()
  databaseService.indexTweets()
})
const app = express()
const httpServer = createServer(app)

app.use(cors())
const port = process.env.PORT || 4000

//Tạo folder upload
initFolder()

app.use(express.json())
app.use('/users', usersRoutes)
app.use('/medias', mediasRoutes)
app.use('/tweets', tweetsRouters)
app.use('/bookmarks', bookmarksRouters)
app.use('/likes', likesRouters)
app.use('/search', searchRouter)
app.use('/conversations', conversationsRouter)
app.use('/static', staticRoutes)
app.use('/static/video', express.static(UPLOAD_VIDEO_DIR))

app.use(defaultErrorHandler)

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000'
  }
})

const users: {
  [key: string]: {
    socket_id: string
  }
} = {}
io.on('connection', (socket) => {
  // console.log(`user ${socket.id} connected`)
  const user_id = socket.handshake.auth._id
  users[user_id] = {
    socket_id: socket.id
  }

  socket.on('private_message', async (data) => {
    const receiver_socket_id = users[data.to]?.socket_id
    if (!receiver_socket_id) return
    await databaseService.conversations.insertOne(
      new Conversation({
        sender_id: new ObjectId(data.from),
        receiver_id: new ObjectId(data.to),
        content: data.content
      })
    )
    socket.to(receiver_socket_id).emit('receive_private_message', {
      content: data.content,
      from: user_id
    })
  })

  socket.on('disconnect', () => {
    delete users[user_id]
    // console.log(`user ${socket.id} disconnected`)
  })
})

httpServer.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
