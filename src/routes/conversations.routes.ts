import { Router } from 'express'
import { getConversationController } from '~/controllers/conversations.controller'
import { paginationValidator } from '~/middlewares/tweets.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const conversationsRouter = Router()

/**
 * Description: Like Tweet
 * Path: /
 * Method: POST
 * Body: { tweet_id : string }
 * Headers: { Authorization: Bearer <access_token> }
 */
conversationsRouter.get(
  '/receiver/:receiver_id',
  accessTokenValidator,
  verifiedUserValidator,
  paginationValidator,
  wrapRequestHandler(getConversationController)
)
export default conversationsRouter
