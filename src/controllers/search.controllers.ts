import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response } from 'express'
import { SearchQuey } from '~/models/requests/Search.requests'
import searchService from '~/services/search.services'

export const searchController = async (req: Request<ParamsDictionary, any, any, SearchQuey>, res: Response) => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const result = await searchService.search({
    limit,
    page,
    content: req.query.content,
    media_type: req.query.media_type,
    user_id: req.decoded_authorization?.user_id as string
  })
  return res.json({
    message: 'Search Successfully',
    result: {
      tweets: result.tweets,
      limit,
      page,
      totalPage: Math.ceil(result.total / limit)
    }
  })
}
