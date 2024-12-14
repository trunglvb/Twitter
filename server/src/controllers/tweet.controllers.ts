import { HttpStatusCode } from '@/constants/enums';
import { ICreateTweetBody } from '@/models/requests/tweet.request';
import { NextFunction, Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

const createTweetController = async (
  req: Request<ParamsDictionary, any, ICreateTweetBody>,
  res: Response,
  _next: NextFunction
) => {
  const { user } = req;
  return res.status(HttpStatusCode.Ok).json({
    message: 'success',
    result: ''
  });
};

export { createTweetController };
