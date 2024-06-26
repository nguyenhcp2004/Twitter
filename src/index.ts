import express from 'express'
import databaseService from './services/database.service'
import { usersRoutes } from './routes/users.routes'
import { defaultErrorHandler } from './middlewares/error.middleware'
import { mediasRoutes } from './routes/medias.routes'
import { initFolder } from './utils/file'
import { UPLOAD_VIDEO_DIR } from './constants/dir'
import { staticRoutes } from './routes/static.routes'
import cors, { CorsOptions } from 'cors'
import tweetsRouters from './routes/tweets.routes'
import bookmarksRouters from './routes/bookmarks.routes'
import likesRouters from './routes/likes.routes'
import searchRouter from './routes/search.routes'
import { createServer } from 'http'
import fs from 'fs'
import conversationsRouter from './routes/conversations.routes'
import { initSocket } from './utils/socket'
import YAML from 'yaml'
import path from 'path'
import swaggerUi from 'swagger-ui-express'
import { envConfig, isProduction } from '~/constants/config'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'

const file = fs.readFileSync(path.resolve('openapi/twitter-swagger.yaml'), 'utf8')
const swaggerDocument = YAML.parse(file)

databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexRefreshTokens()
  databaseService.indexVideoStatus()
  databaseService.indexFollowers()
  databaseService.indexTweets()
})
const app = express()
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
})
app.use(limiter)
const httpServer = createServer(app)

app.use(helmet())
const corsOptions: CorsOptions = {
  origin: isProduction ? envConfig.clientUrl : '*'
}
app.use(cors(corsOptions))
const port = envConfig.port || 4000

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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(defaultErrorHandler)
initSocket(httpServer)

httpServer.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
