import fs from 'fs';
import { Request } from 'express';
import formidable, { File } from 'formidable';
import { UPLOAD_TEMP_DIR, UPLOAD_VIDEO_DIR, UPLOAD_IMAGE_DIR } from '@/constants/dir';

export const initFolder = () => {
  const uploadFolderPath = [UPLOAD_TEMP_DIR, UPLOAD_VIDEO_DIR, UPLOAD_IMAGE_DIR];
  uploadFolderPath.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true // tao folder nested
      });
    }
  });
};

export const handleUploadImage = async (req: Request, maxFiles: number) => {
  const form = formidable({
    uploadDir: UPLOAD_TEMP_DIR,
    maxFiles: maxFiles,
    keepExtensions: true, // khi upload thi lay duoi mo rong,
    maxFileSize: maxFiles * 1024 * 500, // 500KB
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

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      if (!Boolean(files?.image)) {
        return reject(new Error('Image is require'));
      }
      resolve(files.image as File[]);
    });
  });
};

export const handleUploadVideo = async (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_VIDEO_DIR,
    maxFiles: 1,
    keepExtensions: true, // khi upload thi lay duoi mo rong,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    filter: function ({ name, originalFilename, mimetype }) {
      // keep only images
      //name la key
      // const valid = name === 'image' && Boolean(mimetype && mimetype.includes('image'));
      // if (!valid) {
      //   form.emit('error' as any, new Error('File type is invalid') as any);
      // }
      return true;
    }
  });

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      if (!Boolean(files?.video)) {
        return reject(new Error('Video is require'));
      }
      resolve(files.video as File[]);
    });
  });
};

export const getFileName = (name: string) => {
  const arrName = name.split('.');
  arrName.pop();
  return arrName.join('');
};
