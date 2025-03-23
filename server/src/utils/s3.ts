//upload file to s3
import dotenv from 'dotenv';
import { S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import fs from 'fs';

dotenv.config();
import path from 'path';
const s3Client = new S3({
  region: process.env.AWS_REGION,
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string
  }
});

//test connect
// s3Client.listBuckets({}).then((data) => {
//   console.log('Buckets:', data);
// });
const file = fs.readFileSync(path.resolve('uploads/image/1883114be1a5a35848efb6c00.jpg'));

const parallelUploads3 = new Upload({
  client: s3Client,
  params: {
    Bucket: 'twitter-trunglvb-clone',
    Key: 'anh.jpg',
    Body: file,
    ContentType: 'image/jpeg'
  }, //Bucket la ten bucket tren aws s3, Key la ten file, Body chon dinh dang la Buffer => chon fiel trong may va upload len

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
});

parallelUploads3.on('httpUploadProgress', (progress) => {
  console.log(progress);
});

parallelUploads3.done().then((res) => console.log(res));
