import databaseService from '@/services/database.services';
import { de_AT } from '@faker-js/faker';
import { ObjectId } from 'mongodb';

class ConversationService {
  getConversation = async (senderId: string, receiverId: string) => {
    console.log(senderId, receiverId);
    const conversation = await databaseService.conversation
      .find({
        sender_id: new ObjectId(senderId),
        receiver_id: new ObjectId(receiverId)
      })
      .toArray();
    console.log('conversation', conversation);
    return conversation;
  };
}

const conversationService = new ConversationService();

export default conversationService;
