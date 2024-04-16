import { wrapRequestHandler } from '~/utils/handlers'
import { Router } from 'express'
import * as controller from '../controllers/medias.controllers'
const router: Router = Router()

router.post('/upload-image', wrapRequestHandler(controller.uploadImage))
router.post('/upload-video', wrapRequestHandler(controller.uploadVideo))

export const mediasRoutes: Router = router
