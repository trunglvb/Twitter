import { getConversationController } from '@/controllers/conversation.controllers';
import { accessTokenValidator, verifyUserValidator } from '@/middlewares/users.middleware';
import { wrapRequestHandler } from '@/utils/handlers';
import express from 'express';
const conversationRouter = express.Router();

conversationRouter.get(
  '/receiver/:receiver_id',
  accessTokenValidator,
  verifyUserValidator,
  wrapRequestHandler(getConversationController)
);

export default conversationRouter;
