import { getConversationController } from '@/controllers/conversation.controllers';
import { paginationValidator } from '@/middlewares/tweet.middleware';
import { accessTokenValidator, getConversaitonsValidator, verifyUserValidator } from '@/middlewares/users.middleware';
import { wrapRequestHandler } from '@/utils/handlers';
import express from 'express';
const conversationRouter = express.Router();

conversationRouter.get(
  '/receiver/:receiver_id',
  accessTokenValidator,
  verifyUserValidator,
  getConversaitonsValidator,
  wrapRequestHandler(getConversationController)
);

export default conversationRouter;
