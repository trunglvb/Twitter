import { defaultPagination } from '@/constants/constant';
import { ETweetType, HttpStatusCode } from '@/constants/enums';
import { ICreateTweetBody } from '@/models/requests/tweet.request';
import databaseService from '@/services/database.services';
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
  const user_id = req.decode_access_token?.user_id!;
  const viewResult = await tweetServices.increaseView(tweet_id, user_id);
  const tweet = { ...req.tweet, user_views: viewResult.user_views, guest_views: viewResult.guest_views };
  return res.status(HttpStatusCode.Ok).json({
    message: 'Get tweet successfully',
    result: tweet
  });
};

const getTweetChilrenController = async (
  req: Request<ParamsDictionary, any, { page: number; limit: number; type: ETweetType }>,
  res: Response,
  _next: NextFunction
) => {
  const { tweet_id } = req.params;
  const { page, limit, type } = req.body;
  const result = await tweetServices.getTweetChildren({
    tweet_id,
    type: type,
    limit: limit || defaultPagination.limit,
    page: page || defaultPagination.page
  });
  return res.status(HttpStatusCode.Ok).json({
    message: 'Get tweet children successfully',
    result: {
      tweets: result,
      type,
      page,
      limit
    }
  });
};

export { createTweetController, getTweetController, getTweetChilrenController };
