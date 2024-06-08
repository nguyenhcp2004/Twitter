import { Request, Response } from 'express'
import conversationService from '~/services/conversations.services'

export const getConversationController = async (req: Request, res: Response) => {
  const { receiver_id } = req.params
  const user_id = req.decoded_authorization?.user_id as string
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const result = await conversationService.getConversations({ sender_id: user_id, receiver_id, limit, page })
  res.json({
    message: 'Get conversations successfully',
    result: {
      limit,
      page,
      totalPage: Math.ceil(result.total / limit),
      conversations: result.conversations
    }
  })
}
