import { UPLOAD_IMAGE_DIR } from '@/constants/dir';
import { IS_PRODUCTION } from '@/utils/config';
import { getFileName, handleUploadImage, handleUploadVideo } from '@/utils/file';
import { Request } from 'express';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import dotenv from 'dotenv';
import { MediaType } from '@/constants/enums';
import { IMedia } from '@/models/types/media.types';
import { uploadFileToS3 } from '@/utils/s3';
import mime from 'mime';
dotenv.config();

class MediaService {
  handleUploadVideo = async (req: Request) => {
    const files = await handleUploadVideo(req);
    const newName = files[0]?.newFilename!;
    return {
      url: IS_PRODUCTION
        ? `${process.env.SERVER_HOST}/uploads/${newName}`
        : `http://localhost:${process.env.PORT}/static/video/${newName}`,
      type: MediaType.Video
    };
  };
  handleUploadImageService = async (req: Request, maxFiles: number) => {
    const files = await handleUploadImage(req, maxFiles);
    console.log(files);
    const result: IMedia[] = await Promise.all(
      files?.map(async (file) => {
        const newName = getFileName(file?.newFilename);
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, `${newName}.jpg`);

        //voi image can duong dan tam thoi de resize anh, sau do tao duong dan moi va xoa duong dan temp => sau do xoa duong dan image khi da upload thanh cong len s3
        await sharp(file?.filepath).jpeg({ mozjpeg: true }).toFile(newPath);
        const s3Result = await uploadFileToS3({
          fileName: `${newName}.jpg`,
          filePath: newPath,
          contentType: mime.getType(newPath) as string
        });

        //xoa anh tren local
        await Promise.all([fsPromises.unlink(file.filepath), fsPromises.unlink(newPath)]);

        return {
          url: s3Result?.Location as string,
          type: MediaType.Image
        };
      })
    );
    return result;
  };
}

const mediaServices = new MediaService();
export default mediaServices;
