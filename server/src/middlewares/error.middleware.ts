import { HttpStatusCode } from '@/constants/enums';
import { ErrorWithStatus } from '@/utils/errors';
import { Request, Response, NextFunction } from 'express';
import { omit } from 'lodash';

export const defaultError = (err: any, req: Request, res: Response, next: NextFunction) => {
  try {
    if (err instanceof ErrorWithStatus) {
      return res.status(err?.status).json(omit(err, ['status']));
    }
    const finalError: any = {};
    //phai cau hinh dang json cho err
    Object.getOwnPropertyNames(err).forEach((key) => {
      if (
        !Object.getOwnPropertyDescriptor(err, key)?.writable ||
        !Object.getOwnPropertyDescriptor(err, key)?.configurable
      ) {
        return;
      }
      finalError[key] = err[key];
    });

    return res.status(HttpStatusCode.InternalServerError).json({
      mes: finalError.message,
      err: omit(finalError, ['stack'])
    });
  } catch (error) {
    return res.status(HttpStatusCode.InternalServerError).json({
      mes: 'Internal server error'
    });
  }
};
