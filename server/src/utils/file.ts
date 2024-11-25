import fs from 'fs';
import path from 'path';
import { Request } from 'express';
import formidable, { File } from 'formidable';
import { UPLOAD_TEMP_DIR } from '@/constants/dir';

export const initFolder = () => {
  const uploadFolderPath = UPLOAD_TEMP_DIR;
  if (!fs.existsSync(uploadFolderPath)) {
    fs.mkdirSync(uploadFolderPath, {
      recursive: true // tao folder nested
    });
  }
};

export const handleUploadSingleImage = async (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_TEMP_DIR,
    maxFiles: 1,
    keepExtensions: true, // khi upload thi lay duoi mo rong,
    maxFileSize: 2000 * 1024, // 2MB
    filter: function ({ name, originalFilename, mimetype }) {
      // keep only images
      //name la key
      const valid = name === 'image' && Boolean(mimetype && mimetype.includes('image'));
      if (!valid) {
        form.emit('error' as any, new Error('File type is invalid') as any);
      }
      return valid;
    }
  });

  return new Promise<File>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      if (!Boolean(files?.image)) {
        return reject(new Error('Image is require'));
      }
      resolve((files.image as File[])[0]);
    });
  });
};

export const getFileName = (name: string) => {
  const arrName = name.split('.');
  arrName.pop();
  return arrName.join('');
};
