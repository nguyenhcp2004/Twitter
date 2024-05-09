import { Router } from 'express'
import * as controller from '../controllers/users.controllers'
import * as validator from '../middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
import { filterMiddelware } from '~/middlewares/common.middleware'
import { UpdateMeReqBody } from '~/models/requests/User.requests'
const router: Router = Router()

/**
 * Description:Login a user
 * Path: /login
 * Method: POST
 * Body: { email: string, password: string }
 */
router.post('/login', validator.loginValidator, wrapRequestHandler(controller.login))

/**
 * Description: OAuth with Google
 * Path: /oauth/google
 * Method: GET
 * Query: { code: string }
 */
router.get('/oauth/google', wrapRequestHandler(controller.oauth))

/**
 * Description: Register a new user
 * Path: /register
 * Method: POST
 * Body: { name: string, email: string, password: string, confirm_password: string, date_of_birth: ISO8601}
 */
router.post('/register', validator.registerValidator, wrapRequestHandler(controller.register))
/**
 * Description: Logout a user
 * Path: /logout
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { name: string, email: string, password: string, confirm_password: string, date_of_birth: ISO8601}
 */
router.post(
  '/logout',
  validator.accessTokenValidator,
  validator.refreshTokenValidator,
  wrapRequestHandler(controller.logout)
)

/**
 * Description: Refresh token
 * Path: /refresh-token
 * Method: POST
 * Body: { refresh_token: string }
 */
router.post('/refresh-token', validator.refreshTokenValidator, wrapRequestHandler(controller.refreshToken))

/**
 * Description: Verify email when user cclient click on the link in email
 * Path: /verify-email
 * Method: POST
 * Body: { email_verify_token: string }
 */
router.post('/verify-email', validator.emailVerifyTokenValidator, wrapRequestHandler(controller.emailVerify))

/**
 * Description: Verify email when user cclient click on the link in email
 * Path: /resend-verify-email
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: {}
 */
router.post('/resend-verify-email', validator.accessTokenValidator, wrapRequestHandler(controller.resendVerifyEmail))

/**
 * Description: Submit email to reset password, send email to user
 * Path: /forgot-password
 * Method: POST
 * Body: { email: string }
 */
router.post('/forgot-password', validator.forgotPasswordValidator, wrapRequestHandler(controller.forgotPasswword))

/**
 * Description: Verify link in email to reset password
 * Path: /verify-forgot-password
 * Method: POST
 * Body: { forgot_password_token: string }
 */
router.post(
  '/verify-forgot-password',
  validator.verifyForgotPasswordValidator,
  wrapRequestHandler(controller.verifyForgotPassword)
)

/**
 * Description: Reset password
 * Path: /reset-password
 * Method: POST
 * Body: { forgot_password_token: string, password: string, confirm_password: string }
 */
router.post('/reset-password', validator.resetPasswordValidator, wrapRequestHandler(controller.resetPassword))

/**
 * Description: Get my profile
 * Path: /me
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
router.get('/me', validator.accessTokenValidator, wrapRequestHandler(controller.getMe))

/**
 * Description: Update my profile
 * Path: /me
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Body: UserSchema
 */
router.patch(
  '/me',
  validator.accessTokenValidator,
  validator.verifiedUserValidator,
  validator.updateMeValidator,
  filterMiddelware<UpdateMeReqBody>([
    'avatar',
    'bio',
    'cover_photo',
    'date_of_birth',
    'location',
    'name',
    'username',
    'website'
  ]),
  wrapRequestHandler(controller.updateMe)
)

/**
 * Description: Get user profile
 * Path: /:username
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
router.get('/:username', wrapRequestHandler(controller.getProfile))

/**
 * Description: Follow someone
 * Path: /follow
 * Method: POST
 * Body: { user_id: string }
 */
router.post(
  '/follow',
  validator.accessTokenValidator,
  validator.verifiedUserValidator,
  validator.followValidator,
  wrapRequestHandler(controller.follow)
)

/**
 * Description: Unfollow someone
 * Path: /follow
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 */
router.delete(
  '/follow/:user_id',
  validator.accessTokenValidator,
  validator.verifiedUserValidator,
  validator.unfollowValidator,
  wrapRequestHandler(controller.unfollow)
)

/**
 * Description: Change password
 * Path: /change-password
 * Method: PUT
 * Header: { Authorization: Bearer <access_token> }
 * Body: { old_password: string, password: string, confirm_password: string }
 */
router.put(
  '/change-password',
  validator.accessTokenValidator,
  validator.verifiedUserValidator,
  validator.changePasswordValidator,
  wrapRequestHandler(controller.changePassword)
)

export const usersRoutes: Router = router
