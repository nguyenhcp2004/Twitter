import { config } from 'dotenv'
import argv from 'minimist'
const options = argv(process.argv.slice(2))
export const isProduction = options.env === 'production'
config({
  path: options.env ? `.env.${options.env}` : '.env'
})

export const envConfig = {
  port: (process.env.PORT as string) || 4000,
  host: process.env.HOST as string,
  dbUsername: process.env.DB_USERNAME as string,
  dbPassword: process.env.DB_PASSWORD as string,
  dbName: process.env.DB_NAME as string,
  passwordSecret: process.env.PASSWORD_SECRET as string,
  jwtSecret: process.env.JWT_SECRET as string,
  jwtSecretAccessToken: process.env.JWT_SECRET_ACCESS_TOKEN as string,
  jwtSecretRefreshToken: process.env.JWT_SECRET_REFRESH_TOKEN as string,
  jwtSecretEmailVerifyToken: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
  jwtSecretForgotPasswordToken: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
  emailVerifyTokenExpiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN as string,
  forgotPasswordTokenExpiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN as string,
  dbUsersCollection: process.env.DB_USERS_COLLECTION as string,
  dbRefreshTokenCollection: process.env.DB_REFRESH_TOKEN_COLLECTION as string,
  dbFollowersCollection: process.env.DB_FOLLOWERS_COLLECTION as string,
  dbVideoStatusCollection: process.env.DB_VIDEO_STATUS_COLLECTION as string,
  dbTweetsCollection: process.env.DB_TWEETS_COLLECTION as string,
  dbHashTagsCollection: process.env.DB_HASHTAGS_COLLECTION as string,
  dbBookmarksCollection: process.env.DB_BOOKMARKS_COLLECTION as string,
  dbLikesCollection: process.env.DB_LIKES_COLLECTION as string,
  dbConversationsCollection: process.env.DB_CONVERSATIONS_COLLECTION as string,
  googleClientId: process.env.GOOGLE_CLIENT_ID as string,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  googleRedirectUri: process.env.GOOGLE_REDIRECT_URI as string,
  clientRedirectCallBack: process.env.CLIENT_REDIRECT_CALLBACK as string,
  clientUrl: process.env.CLIENT_URL as string,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  awsRegion: process.env.AWS_REGION as string,
  sesFromAddress: process.env.SES_FROM_ADDRESS as string,
  s3BucketName: process.env.S3_BUCKET_NAME as string
}
