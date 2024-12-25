import { audienceValidator, isUserLoginedValidator, tweetIdValidator } from './../middlewares/tweet.middleware';
import { createTweetController, getTweetController } from '@/controllers/tweet.controllers';
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
  '/:tweet_id',
  tweetIdValidator,
  isUserLoginedValidator(accessTokenValidator),
  isUserLoginedValidator(verifyUserValidator),
  wrapRequestHandler(audienceValidator),
  wrapRequestHandler(getTweetController)
);

export default tweetRouter;
