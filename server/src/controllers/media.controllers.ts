import mediaServices from '@/services/media.services';
import { NextFunction, Request, Response } from 'express';

export const uploadSingleImageController = async (req: Request, res: Response, _next: NextFunction) => {
  const data = await mediaServices.handleUploadImage(req, 4);
  return res.json({
    message: 'Upload image success',
    data: data
  });
};
