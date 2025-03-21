import { ParamsDictionary } from 'express-serve-static-core';
import { NextFunction, Request, Response } from 'express';
import { ICreateBookmarkBody, IUnBookmarkParams } from '@/models/requests/bookmark.request';
import { HttpStatusCode } from '@/constants/enums';
import bookmarkService from '@/services/bookmark.services';

const createBookmarkController = async (
  req: Request<ParamsDictionary, any, ICreateBookmarkBody>,
  res: Response,
  _next: NextFunction
) => {
  const { body } = req;
  const user_id = req.decode_access_token?.user_id;
  const result = await bookmarkService.createBookmark({ user_id: user_id!, tweet_id: body.tweet_id });

  return res.status(HttpStatusCode.Ok).json({
    message: 'Create bookmark successfully',
    result: result
  });
};

const unBookmarkController = async (req: Request, res: Response, _next: NextFunction) => {
  const { tweet_id } = req.params as IUnBookmarkParams;
  const user_id = req.decode_access_token?.user_id;
  const result = await bookmarkService.unBookmark({ user_id: user_id!, tweet_id: tweet_id });

  return res.status(HttpStatusCode.Ok).json({
    message: 'Unbookmark successfully',
    result: result
  });
};

export { createBookmarkController, unBookmarkController };
