import databaseService from '@/services/database.services';
import { de_AT } from '@faker-js/faker';
import { ObjectId } from 'mongodb';

interface IGetConversationParams {
  senderId: string;
  receiverId: string;
  limit: number;
  page: number;
}
class ConversationService {
  getConversation = async (params: IGetConversationParams) => {
    const { senderId, receiverId, limit, page } = params;
    const match = {
      $or: [
        { sender_id: new ObjectId(senderId), receiver_id: new ObjectId(receiverId) },
        { sender_id: new ObjectId(receiverId), receiver_id: new ObjectId(senderId) }
      ]
    };
    const conversation = await databaseService.conversation
      .find(match)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();
    const total = await databaseService.conversation.countDocuments(match);
    return { conversation, total };
  };
}

const conversationService = new ConversationService();

export default conversationService;
