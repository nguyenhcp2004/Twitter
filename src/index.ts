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
import { verifyAccessToken } from './utils/commons'
import { TokenPayload } from './models/requests/User.requests'
import { UserVerifyStatus } from './constants/enums'
import { ErrorWithStatus } from './models/Errors'
import { USER_MESSAGES } from './constants/messages'
import HTTP_STATUS from './constants/httpStatus'

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
io.use(async (socket, next) => {
  try {
    const { Authorization } = socket.handshake.auth
    const access_token = Authorization.split(' ')[1]
    const decoded_authorization = await verifyAccessToken(access_token)
    const { verify } = decoded_authorization as TokenPayload
    if (verify !== UserVerifyStatus.Verified) {
      throw new ErrorWithStatus({
        message: USER_MESSAGES.USER_NOT_VERIFIED,
        status: HTTP_STATUS.FORBIDDEN
      })
    }
    //Truyền decoded_authorization vào socket để sử dụng ở các middleware khác
    socket.handshake.auth.decoded_authorization = decoded_authorization
    next()
  } catch (error) {
    next({
      message: 'Unauthorized',
      name: 'UnauthorizedError',
      data: error
    })
  }
})
io.on('connection', (socket) => {
  // console.log(`user ${socket.id} connected`)
  const { user_id } = socket.handshake.auth.decoded_authorization as TokenPayload
  users[user_id] = {
    socket_id: socket.id
  }

  socket.on('CLIENT_SENT_MESSAGE', async (data) => {
    const { sender_id, receiver_id, content } = data.payload
    const receiver_socket_id = users[receiver_id]?.socket_id
    const conversation = new Conversation({
      sender_id: new ObjectId(sender_id),
      receiver_id: new ObjectId(receiver_id),
      content: content
    })
    const result = await databaseService.conversations.insertOne(conversation)
    conversation._id = result.insertedId
    if (receiver_socket_id) {
      socket.to(receiver_socket_id).emit('SERVER_SEND_MESSAGE', {
        payload: conversation
      })
    }
  })

  socket.on('disconnect', () => {
    delete users[user_id]
    // console.log(`user ${socket.id} disconnected`)
  })
})

httpServer.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
