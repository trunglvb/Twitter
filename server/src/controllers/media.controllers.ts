import mediaServices from '@/services/media.services';
import { NextFunction, Request, Response } from 'express';

export const uploadSingleImageController = async (req: Request, res: Response, _next: NextFunction) => {
  const data = await mediaServices.handleUploadSingleImage(req);
  return res.json({
    message: 'Success',
    data: data
  });
};
