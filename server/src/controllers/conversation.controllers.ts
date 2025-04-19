import { HttpStatusCode } from '@/constants/enums';
import { IGetConversationParams } from '@/models/requests/conversation.request';
import conversationService from '@/services/conversation.services';
import { NextFunction, Request, Response } from 'express';

const getConversationController = async (req: Request, res: Response, _next: NextFunction) => {
  const sender_id = req.decode_access_token?.user_id! as string;
  const { receiver_id } = req.params as IGetConversationParams;
  const { limit = 10, page = 1 } = req.query;

  const conversations = await conversationService.getConversation({
    senderId: sender_id,
    receiverId: receiver_id,
    limit: Number(limit),
    page: Number(page)
  });

  return res.status(HttpStatusCode.Ok).json({
    message: 'Get conversations success',
    result: {
      conversations: conversations.conversation,
      total: conversations.total,
      limit: limit,
      page: page,
      totalPage: Math.ceil(Number(conversations.total) / Number(limit))
    }
  });
};

export { getConversationController };
