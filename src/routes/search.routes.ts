import { Router } from 'express'
import { searchController } from '~/controllers/search.controllers'
import { paginationValidator } from '~/middlewares/tweets.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'

const searchRouter = Router()

searchRouter.get('/', paginationValidator, accessTokenValidator, verifiedUserValidator, searchController)

export default searchRouter
