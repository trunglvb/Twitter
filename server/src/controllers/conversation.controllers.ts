import { HttpStatusCode } from '@/constants/enums';
import { IGetConversationParams } from '@/models/requests/conversation.request';
import conversationService from '@/services/conversation.services';
import { NextFunction, Request, Response } from 'express';

const getConversationController = async (req: Request, res: Response, _next: NextFunction) => {
  const sender_id = req.decode_access_token?.user_id! as string;
  const { receiver_id } = req.params as IGetConversationParams;

  const conversations = await conversationService.getConversation(sender_id, receiver_id);

  return res.status(HttpStatusCode.Ok).json({
    message: 'Get user infomation success',
    result: conversations
  });
};

export { getConversationController };
