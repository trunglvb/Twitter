import { ParamsDictionary } from 'express-serve-static-core';
import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from '@/constants/enums';
import { ICreateLikeBody, IUnLikeParams } from '@/models/requests/like.request';
import likesService from '@/services/like.services';

const createLikeController = async (
  req: Request<ParamsDictionary, any, ICreateLikeBody>,
  res: Response,
  _next: NextFunction
) => {
  const { body } = req;
  const user_id = req.decode_access_token?.user_id;
  const result = await likesService.createLike({ user_id: user_id!, tweet_id: body.tweet_id });

  return res.status(HttpStatusCode.Ok).json({
    message: 'Create like successfully',
    result: result
  });
};

const unLikeController = async (req: Request, res: Response, _next: NextFunction) => {
  const { tweet_id } = req.params as IUnLikeParams;
  const user_id = req.decode_access_token?.user_id;
  const result = await likesService.unLike({ user_id: user_id!, tweet_id: tweet_id });

  return res.status(HttpStatusCode.Ok).json({
    message: 'Unlike successfully',
    result: result
  });
};

export { createLikeController, unLikeController };
