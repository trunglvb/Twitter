import fs from 'fs';
import path from 'path';
import { Request } from 'express';
import formidable from 'formidable';

export const initFolder = () => {
  const uploadFolderPath = path.resolve('uploads');
  if (!fs.existsSync(uploadFolderPath)) {
    fs.mkdirSync(uploadFolderPath, {
      recursive: true // tao folder nested
    });
  }
};

export const handleUploadSingleImage = async (req: Request) => {
  const form = formidable({
    uploadDir: path.resolve('uploads'),
    maxFiles: 1,
    keepExtensions: true, // khi upload thi lay duoi mo rong,
    maxFileSize: 300 * 1024 // 300kb
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      resolve(files);
    });
  });
};
