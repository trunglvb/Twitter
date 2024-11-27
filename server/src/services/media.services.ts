import { UPLOAD_DIR } from '@/constants/dir';
import { IS_PRODUCTION } from '@/utils/config';
import { getFileName, handleUploadSingleImage } from '@/utils/file';
import { Request } from 'express';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import dotenv from 'dotenv';
dotenv.config();

class MediaService {
  handleUploadSingleImage = async (req: Request) => {
    const file = await handleUploadSingleImage(req);
    const newName = getFileName(file?.newFilename);
    await sharp(file?.filepath)
      .jpeg({ mozjpeg: true, quality: 75 })
      .toFile(path.resolve(UPLOAD_DIR, `${newName}.jpg`));
    fs.unlinkSync(file.filepath);
    return IS_PRODUCTION
      ? `${process.env.SERVER_HOST}/uploads/${newName}.jpg`
      : `http://localhost:${process.env.PORT}/uploads/${newName}.jpg`;
  };
}

const mediaServices = new MediaService();
export default mediaServices;
