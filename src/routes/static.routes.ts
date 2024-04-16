import { Router } from 'express'
import * as controller from '../controllers/medias.controllers'
const router: Router = Router()

router.get('/image/:name', controller.serveImage)
router.get('/video/:name', controller.serveVideo)

export const staticRoutes: Router = router
