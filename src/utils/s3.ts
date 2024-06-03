import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import fs from 'fs'
import path from 'path'

// a client can be shared by different commands.
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string
  }
})

const params = {
  /** input parameters */
}
const command = new ListBucketsCommand(params)
// async/await.
s3.send(command).then(
  (data) => {
    console.log(data)
  },
  (error) => {
    console.log(error)
  }
)

const file = fs.readFileSync(path.resolve('uploads/images/7a52f411fd4a532c011be5c00.jpg'))
const parallelUploads3 = new Upload({
  client: s3,
  params: { Bucket: 'twitter-clone-2024-3005-ap-southeast-1', Key: 'anh.jpg', Body: file, ContentType: 'image/jpeg' },

  // optional tags
  tags: [
    /*...*/
  ],

  // additional optional fields show default values below:

  // (optional) concurrency configuration
  queueSize: 4,

  // (optional) size of each part, in bytes, at least 5MB
  partSize: 1024 * 1024 * 5,

  // (optional) when true, do not automatically call AbortMultipartUpload when
  // a multipart upload fails to complete. You should then manually handle
  // the leftover parts.
  leavePartsOnError: false
})

// parallelUploads3.on('httpUploadProgress', (progress) => {
//   console.log(progress)
// })

parallelUploads3.done().then((progress) => {
  console.log(progress)
})
