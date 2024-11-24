import { handleUploadSingleImage } from '@/utils/file';
import { NextFunction, Request, Response } from 'express';

export const uploadSingleImageController = async (req: Request, res: Response, _next: NextFunction) => {
  const data = await handleUploadSingleImage(req);
  return res.send({
    message: 'Success'
  });
};
