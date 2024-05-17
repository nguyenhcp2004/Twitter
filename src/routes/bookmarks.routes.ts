import { Router } from 'express'
import { bookmarkTweetController, unbookmarkTweetController } from '~/controllers/bookmarks.controllers'
import { tweetIdValidator } from '~/middlewares/tweets.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const bookmarksRouters = Router()
/**
 * Description: Bookmark Tweet
 * Path: /
 * Method: POST
 * Body: { tweet_id : string }
 * Headers: { Authorization: Bearer <access_token> }
 */
bookmarksRouters.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(bookmarkTweetController)
)

/**
 * Description: Unbookmark Tweet
 * Path: /:tweet_id
 * Method: DELETE
 * Headers: { Authorization: Bearer <access_token> }
 */
bookmarksRouters.delete(
  '/tweets/:tweet_id',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(unbookmarkTweetController)
)

export default bookmarksRouters
