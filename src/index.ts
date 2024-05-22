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

config()
databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexRefreshTokens()
  databaseService.indexVideoStatus()
  databaseService.indexFollowers()
})
const app = express()
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
app.use('/static', staticRoutes)
app.use('/static/video', express.static(UPLOAD_VIDEO_DIR))
app.use(defaultErrorHandler)
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
