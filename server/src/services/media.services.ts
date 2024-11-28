import { UPLOAD_IMAGE_DIR } from '@/constants/dir';
import { IS_PRODUCTION } from '@/utils/config';
import { getFileName, handleUploadImage, handleUploadVideo } from '@/utils/file';
import { Request } from 'express';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import dotenv from 'dotenv';
import { MediaType } from '@/constants/enums';
import { IMedia } from '@/models/types/media.types';
dotenv.config();

class MediaService {
  handleUploadImage = async (req: Request, maxFiles: number) => {
    const files = await handleUploadImage(req, maxFiles);
    const newName = getFileName(files[0]?.newFilename);
    return {
      url: IS_PRODUCTION
        ? `${process.env.SERVER_HOST}/uploads/${newName}`
        : `http://localhost:${process.env.PORT}/uploads/video/${newName}`,
      type: MediaType.Video
    };
  };
  handleUploadVideo = async (req: Request) => {
    const files = await handleUploadVideo(req);
    const result: IMedia[] = await Promise.all(
      files?.map(async (file) => {
        const newName = getFileName(file?.newFilename);
        return {
          url: IS_PRODUCTION
            ? `${process.env.SERVER_HOST}/uploads/${newName}.jpg`
            : `http://localhost:${process.env.PORT}/uploads/image/${newName}.jpg`,
          type: MediaType.Image
        };
      })
    );
    return result;
  };
}

const mediaServices = new MediaService();
export default mediaServices;
