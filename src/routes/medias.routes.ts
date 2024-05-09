import { wrapRequestHandler } from '~/utils/handlers'
import { Router } from 'express'
import * as controller from '../controllers/medias.controllers'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
const router: Router = Router()

router.post('/upload-image', accessTokenValidator, wrapRequestHandler(controller.uploadImage))
router.post('/upload-video', accessTokenValidator, wrapRequestHandler(controller.uploadVideo))
router.post('/upload-video-hls', accessTokenValidator, wrapRequestHandler(controller.uploadVideoHLS))
router.get('/video-status/:id', accessTokenValidator, wrapRequestHandler(controller.videoStatus))

export const mediasRoutes: Router = router
