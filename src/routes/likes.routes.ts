import { Router } from 'express'
import { unbookmarkTweetController } from '~/controllers/bookmarks.controllers'
import { likeTweetController, unlikeTweetController } from '~/controllers/likes.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const likesRouters = Router()
/**
 * Description: Like Tweet
 * Path: /
 * Method: POST
 * Body: { tweet_id : string }
 * Headers: { Authorization: Bearer <access_token> }
 */
likesRouters.post('/', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(likeTweetController))

/**
 * Description: Unlike Tweet
 * Path: /:tweet_id
 * Method: DELETE
 * Headers: { Authorization: Bearer <access_token> }
 */
likesRouters.delete(
  '/tweets/:tweet_id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(unlikeTweetController)
)

export default likesRouters
