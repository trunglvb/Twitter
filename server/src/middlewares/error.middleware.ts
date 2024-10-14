import { HttpStatusCode } from '@/constants/enums';
import { Request, Response, NextFunction } from 'express';
export const defaultError = (err: any, req: Request, res: Response, next: NextFunction) => {
  return res.status(err?.status || HttpStatusCode.InternalServerError).json(err);
};
