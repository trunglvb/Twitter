import { UPLOAD_DIR } from '@/constants/dir';
import { IS_PRODUCTION } from '@/utils/config';
import { getFileName, handleUploadSingleImage } from '@/utils/file';
import { Request } from 'express';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

class MediaService {
  handleUploadSingleImage = async (req: Request) => {
    const file = await handleUploadSingleImage(req);
    const newName = getFileName(file?.newFilename);
    await sharp(file?.filepath)
      .jpeg({ mozjpeg: true, quality: 75 })
      .toFile(path.resolve(UPLOAD_DIR, `${newName}.jpg`));
    fs.unlinkSync(file.filepath);
    return IS_PRODUCTION
      ? `http://twitter-clone.com/uploads/${newName}.jpg`
      : `http://localhost:4000/uploads/${newName}.jpg`;
  };
}

const mediaServices = new MediaService();
export default mediaServices;
