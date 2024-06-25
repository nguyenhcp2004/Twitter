import { Router } from 'express'
import { getConversationController } from '~/controllers/conversations.controller'
import { paginationValidator } from '~/middlewares/tweets.middlewares'
import { accessTokenValidator, getConversationsValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const conversationsRouter = Router()

/**
 * Description: Get Conversation between 2 users
 * Path: /receiver/:receiver_id
 * Method: POST
 * Params: { receiver_id : string }
 * Query: { limit: number, page: number}
 * Headers: { Authorization: Bearer <access_token> }
 */
conversationsRouter.get(
  '/receiver/:receiver_id',
  accessTokenValidator,
  verifiedUserValidator,
  paginationValidator,
  getConversationsValidator,
  wrapRequestHandler(getConversationController)
)
export default conversationsRouter
