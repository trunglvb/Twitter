import { HttpStatusCode } from '@/constants/enums';
import { ICreateTweetBody } from '@/models/requests/tweet.request';
import tweetServices from '@/services/tweet.services';
import { NextFunction, Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

const createTweetController = async (
  req: Request<ParamsDictionary, any, ICreateTweetBody>,
  res: Response,
  _next: NextFunction
) => {
  const user_id = req.decode_access_token?.user_id;
  const { body } = req;
  const result = await tweetServices.create({ body, user_id: user_id! });
  return res.status(HttpStatusCode.Ok).json({
    message: 'Create tweet successfully',
    result: result
  });
};

const getTweetController = async (req: Request, res: Response, _next: NextFunction) => {
  const { tweet_id } = req.params;
  const result = await tweetServices.getTweet(tweet_id);
  return res.status(HttpStatusCode.Ok).json({
    message: 'Get tweet successfully',
    result: result
  });
};

export { createTweetController, getTweetController };
