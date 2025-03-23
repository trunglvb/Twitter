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

export const uploadFileToS3 = async ({
  fileName,
  filePath,
  contentType
}: {
  fileName: string;
  filePath: string;
  contentType: string;
}) => {
  const parallelUploads3 = new Upload({
    client: s3Client,
    params: {
      //Bucket la ten bucket tren aws s3, Key la ten file, Body chon dinh dang la Buffer => chon fiel trong may va upload len
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: fs.readFileSync(filePath),
      ContentType: contentType //them contentType de khong tu dong download file khi truy cap
    },

    // optional tags
    tags: [],

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

  return parallelUploads3.done();
};
