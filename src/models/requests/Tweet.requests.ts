import { TweetAudience, TweetType } from '~/constants/enums'
import { Media } from '../Others'
import { Query, ParamsDictionary } from 'express-serve-static-core'

export interface TweetRequestBody {
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id: string | null // chỉ null khi tweet gốc
  hashtags: string[]
  mentions: string[]
  medias: Media[]
}

export interface TweetQuery extends Query {
  limit: string
  page: string
  tweet_type: string
}

export interface TweetParam extends ParamsDictionary {
  tweet_id: string
}
