import { UPLOAD_DIR } from '@/constants/dir';
import { getFileName, handleUploadSingleImage } from '@/utils/file';
import { Request } from 'express';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

class MediaService {
  handleUploadSingleImage = async (req: Request) => {
    const file = await handleUploadSingleImage(req);
    const newName = getFileName(file?.newFilename);
    const info = await sharp(file?.filepath)
      .jpeg({ mozjpeg: true, quality: 75 })
      .toFile(path.resolve(UPLOAD_DIR, `${newName}.jpg`));
    fs.unlinkSync(file.filepath);
    return `http://localhost:4000/uploads/${newName}.jpg`;
  };
}

const mediaServices = new MediaService();
export default mediaServices;
