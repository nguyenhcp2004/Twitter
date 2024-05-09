import { TweetRequestBody } from '~/models/requests/Tweet.requests'
import databaseService from './database.service'
import Tweet from '~/models/schemas/Tweet.schema'
import { ObjectId } from 'mongodb'

class TweetsService {
  async createTweet(user_id: string, body: TweetRequestBody) {
    const result = await databaseService.tweets.insertOne(
      new Tweet({
        audience: body.audience,
        content: body.content,
        hashtags: [], //Chỗ này chưa làm tạm thời để rỗng
        mentions: body.mentions,
        medias: body.medias,
        parent_id: body.parent_id,
        type: body.type,
        user_id: new ObjectId(user_id)
      })
    )
    const tweet = await databaseService.tweets.findOne({
      _id: result.insertedId
    })
    return tweet
  }
}

const tweetsService = new TweetsService()
export default tweetsService
