import { createBookmarkController, unBookmarkController } from '@/controllers/bookmark.controllers';
import { tweetIdValidator } from '@/middlewares/tweet.middleware';
import { accessTokenValidator, verifyUserValidator } from '@/middlewares/users.middleware';
import { wrapRequestHandler } from '@/utils/handlers';
import express from 'express';
const bookmarksRouter = express.Router();

bookmarksRouter.post(
  '/create',
  accessTokenValidator,
  verifyUserValidator,
  tweetIdValidator,
  wrapRequestHandler(createBookmarkController)
);

bookmarksRouter.delete(
  '/tweets/:tweet_id',
  accessTokenValidator,
  verifyUserValidator,
  wrapRequestHandler(unBookmarkController)
);

export default bookmarksRouter;
