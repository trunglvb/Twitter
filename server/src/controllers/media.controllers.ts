import { NextFunction, Request, Response } from 'express';
import formidable from 'formidable';
import path from 'path';

export const uploadSingleImageController = async (req: Request, res: Response, _next: NextFunction) => {
  const form = formidable({
    uploadDir: path.resolve('uploads'),
    maxFiles: 1,
    keepExtensions: true, // khi upload thi lay duoi mo rong,
    maxFileSize: 300 * 1024 // 300kb
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      throw Error(err);
    }
    res.json({ fields, files });
  });
};
