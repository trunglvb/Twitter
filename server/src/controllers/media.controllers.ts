import mediaServices from '@/services/media.services';
import { NextFunction, Request, Response } from 'express';

export const uploadSingleImageController = async (req: Request, res: Response, _next: NextFunction) => {
  const data = await mediaServices.handleUploadImageService(req, 1);
  return res.json({
    message: 'Upload image success',
    data: data
  });
};

export const uploadMultipleImageController = async (req: Request, res: Response, _next: NextFunction) => {
  const data = await mediaServices.handleUploadImageService(req, 1);
  return res.json({
    message: 'Upload image success',
    data: data
  });
};

export const uploadVideoController = async (req: Request, res: Response, _next: NextFunction) => {
  const data = await mediaServices.handleUploadVideo(req);
  return res.json({
    message: 'Upload video success',
    data: data
  });
};
