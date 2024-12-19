import { createLikeController, unLikeController } from '@/controllers/like.controllers';
import { tweetIdValidator } from '@/middlewares/tweet.middleware';
import { accessTokenValidator, verifyUserValidator } from '@/middlewares/users.middleware';
import { wrapRequestHandler } from '@/utils/handlers';
import express from 'express';
const likesRouter = express.Router();

likesRouter.post(
  '/create',
  accessTokenValidator,
  verifyUserValidator,
  tweetIdValidator,
  wrapRequestHandler(createLikeController)
);

likesRouter.delete(
  '/tweets/:tweet_id',
  accessTokenValidator,
  verifyUserValidator,
  tweetIdValidator,
  wrapRequestHandler(unLikeController)
);

export default likesRouter;
