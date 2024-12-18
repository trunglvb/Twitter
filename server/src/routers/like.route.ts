import { createLikeController, unLikeController } from '@/controllers/like.controllers';
import { accessTokenValidator, verifyUserValidator } from '@/middlewares/users.middleware';
import { wrapRequestHandler } from '@/utils/handlers';
import express from 'express';
const likesRouter = express.Router();

likesRouter.post('/create', accessTokenValidator, verifyUserValidator, wrapRequestHandler(createLikeController));

likesRouter.delete(
  '/tweets/:tweet_id',
  accessTokenValidator,
  verifyUserValidator,
  wrapRequestHandler(unLikeController)
);

export default likesRouter;
