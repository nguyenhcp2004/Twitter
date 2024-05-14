import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response } from 'express'
import { BookmarkRequestBody } from '~/models/requests/Bookmark.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import likeService from '~/services/likes.services'
import { LikeRequestBody } from '~/models/requests/Like.requests'
import { LIKE_MESSAGES } from '~/constants/messages'

export const likeTweetController = async (req: Request<ParamsDictionary, any, LikeRequestBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await likeService.likeTweet(user_id, req.body.tweet_id)
  res.json({
    message: LIKE_MESSAGES.LIKE_SUCCESSFULLY,
    result
  })
}

export const unlikeTweetController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  await likeService.unlikeTweet(user_id, req.params.tweet_id)
  res.json({
    message: LIKE_MESSAGES.UNLIKE_SUCCESSFULLY
  })
}
