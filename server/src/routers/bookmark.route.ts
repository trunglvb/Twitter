import { createBookmarkController } from '@/controllers/bookmark.controllers';
import { accessTokenValidator, verifyUserValidator } from '@/middlewares/users.middleware';
import { wrapRequestHandler } from '@/utils/handlers';
import express from 'express';
const bookmarksRouter = express.Router();

bookmarksRouter.post(
  '/create',
  accessTokenValidator,
  verifyUserValidator,
  wrapRequestHandler(createBookmarkController)
);

export default bookmarksRouter;
