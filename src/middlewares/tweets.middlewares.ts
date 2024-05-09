import { checkSchema } from 'express-validator'
import { isEmpty } from 'lodash'
import { ObjectId } from 'mongodb'
import { MediaType, TweetAudience, TweetType } from '~/constants/enums'
import { TWEETS_MESSAGES } from '~/constants/messages'
import { numberEnumToArray } from '~/utils/commons'
import { validate } from '~/utils/validation'

const tweetTypes = numberEnumToArray(TweetType)
const tweetAudience = numberEnumToArray(TweetAudience)
const mediaTypes = numberEnumToArray(MediaType)
export const createTweetValidator = validate(
  checkSchema(
    {
      type: {
        isIn: {
          options: [tweetTypes],
          errorMessage: TWEETS_MESSAGES.INVALID_TYPE
        }
      },
      audience: {
        isIn: {
          options: [tweetAudience],
          errorMessage: TWEETS_MESSAGES.INVALID_AUDIENCE
        }
      },
      parent_id: {
        custom: {
          options: (value, { req }) => {
            const type = req.body.type as TweetType
            //Nếu 'type' là retweet, comment, quotetweet thì 'parent_id' phải là 'tweet_id' của tweet cha
            if (
              [TweetType.Retweet, TweetType.Comment, TweetType.QuoteTweet].includes(type) &&
              !ObjectId.isValid(value)
            ) {
              throw new Error(TWEETS_MESSAGES.PARENT_ID_MUST_BE_A_VALID_TWEET_ID)
            }
            //nếu 'type' là tweet thì 'parent_id' phải là null
            if (type === TweetType.Tweet && value !== null) {
              throw new Error(TWEETS_MESSAGES.PARENT_ID_MUST_NULL)
            }

            return true
          }
        }
      },
      content: {
        isString: true,
        custom: {
          options: (value, { req }) => {
            const type = req.body.type as TweetType
            const hashtags = req.body.hashtags as string[]
            const mentions = req.body.mentions as string[]

            //Nếu 'type' là  comment, quotetweet, tweet và không có 'mentions' và 'hashtags' thì 'content' phải là string và không được rỗng
            if (
              [TweetType.Tweet, TweetType.Comment, TweetType.QuoteTweet].includes(type) &&
              isEmpty(hashtags) &&
              isEmpty(mentions) &&
              value === ''
            ) {
              throw new Error(TWEETS_MESSAGES.CONTENT_MUST_BE_A_NON_EMPTY_STRING)
            }
            //nếu 'type' là retweet thì 'content' phải là rỗng
            if (type === TweetType.Retweet && value !== '') {
              throw new Error(TWEETS_MESSAGES.CONTENT_MUST_BE_EMPTY_STRING)
            }

            return true
          }
        }
      },
      hashtags: {
        isArray: true,
        custom: {
          options: (value, { req }) => {
            //Yêu cẩu mỗi phần tử trong array là string
            if (value.some((item: any) => typeof item !== 'string')) {
              throw new Error(TWEETS_MESSAGES.HASHTAGS_MUST_BE_AN_ARRAY_OF_STRING)
            }
            return true
          }
        }
      },
      mentions: {
        isArray: true,
        custom: {
          options: (value, { req }) => {
            //Yêu cẩu mỗi phần tử trong array là user_id
            if (value.some((item: any) => !ObjectId.isValid(item))) {
              throw new Error(TWEETS_MESSAGES.MENTIONS_MUST_BE_AN_ARRAY_OF_USER_ID)
            }

            return true
          }
        }
      },
      medias: {
        isArray: true,
        custom: {
          //Yêu cầu mỗi phần tử trong array là Media Object
          options: (value, { req }) => {
            if (
              value.some((item: any) => {
                return typeof item.url !== 'string' || mediaTypes.includes(item.type)
              })
            ) {
              throw new Error(TWEETS_MESSAGES.MEDIAS_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT)
            }

            return true
          }
        }
      }
    },
    ['body']
  )
)
