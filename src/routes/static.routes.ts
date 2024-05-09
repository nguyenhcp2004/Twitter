import { Router } from 'express'
import * as controller from '../controllers/medias.controllers'
const router: Router = Router()

router.get('/image/:name', controller.serveImage)
router.get('/video-stream/:name', controller.serveVideoStream)
router.get('/video-hls/:id/master.m3u8', controller.serveM3u8)
router.get('/video-hls/:id/:v/:segment', controller.serveSegment)

export const staticRoutes: Router = router
