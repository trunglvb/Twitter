import { HttpStatusCode } from '@/constants/enums';
import { ErrorWithStatus } from '@/utils/errors';
import { Request, Response, NextFunction } from 'express';
import { omit } from 'lodash';

export const defaultError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorWithStatus) {
    return res.status(err?.status).json(err);
  }
  //phai cau hinh dang json cho err
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true });
  });
  return res.status(HttpStatusCode.InternalServerError).json({
    mes: err.message,
    err: omit(err, ['stack'])
  });
};
