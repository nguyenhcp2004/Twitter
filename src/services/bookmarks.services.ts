import Bookmark from '~/models/schemas/Bookmark.schema'
import databaseService from './database.service'
import { ObjectId, WithId } from 'mongodb'

class BookmarkServices {
  async bookmarkTweet(user_id: string, tweetId: string) {
    const result = await databaseService.bookmarks.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id),
        tweet_id: new ObjectId(tweetId)
      },
      {
        $setOnInsert: new Bookmark({ user_id: new ObjectId(user_id), tweet_id: new ObjectId(tweetId) })
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )

    return result as WithId<Bookmark>
  }

  async unbookmarkTweet(user_id: string, tweetId: string) {
    const result = await databaseService.bookmarks.findOneAndDelete({
      user_id: new ObjectId(user_id),
      tweet_id: new ObjectId(tweetId)
    })

    return result as WithId<Bookmark>
  }
}

const bookmarksService = new BookmarkServices()
export default bookmarksService
