import { createTweetController } from '@/controllers/tweet.controllers';
import { accessTokenValidator, verifyUserValidator } from '@/middlewares/users.middleware';
import { wrapRequestHandler } from '@/utils/handlers';
import express from 'express';
const tweetRouter = express.Router();

tweetRouter.post('/create', accessTokenValidator, verifyUserValidator, wrapRequestHandler(createTweetController));

export default tweetRouter;
