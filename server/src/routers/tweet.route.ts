import {
  audienceValidator,
  getTweetChildrenValidator,
  isUserLoginedValidator,
  paginationValidator,
  tweetIdValidator
} from './../middlewares/tweet.middleware';
import {
  createTweetController,
  getNewFeedsController,
  getTweetChilrenController,
  getTweetController
} from '@/controllers/tweet.controllers';
import { createSchemaValidator } from '@/middlewares/tweet.middleware';
import { accessTokenValidator, verifyUserValidator } from '@/middlewares/users.middleware';
import { wrapRequestHandler } from '@/utils/handlers';
import express from 'express';
const tweetRouter = express.Router();

tweetRouter.post(
  '/create',
  accessTokenValidator,
  verifyUserValidator,
  createSchemaValidator,
  wrapRequestHandler(createTweetController)
);

//get tweet
tweetRouter.get(
  '/detail/:tweet_id',
  tweetIdValidator,
  isUserLoginedValidator(accessTokenValidator),
  isUserLoginedValidator(verifyUserValidator),
  wrapRequestHandler(audienceValidator),
  wrapRequestHandler(getTweetController)
);

//get tweet children
//need limit, page, tweet_type
tweetRouter.post(
  '/children/:tweet_id',
  tweetIdValidator,
  paginationValidator,
  getTweetChildrenValidator,
  isUserLoginedValidator(accessTokenValidator),
  isUserLoginedValidator(verifyUserValidator),
  wrapRequestHandler(audienceValidator),
  wrapRequestHandler(getTweetChilrenController)
);

//get new feeds
tweetRouter.post(
  '/new-feeds',
  paginationValidator,
  accessTokenValidator,
  verifyUserValidator,
  wrapRequestHandler(getNewFeedsController)
);

export default tweetRouter;
