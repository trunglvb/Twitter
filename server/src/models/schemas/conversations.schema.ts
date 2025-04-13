import { ObjectId } from 'mongodb';

type IConversationsType = {
  _id?: ObjectId;
  sender_id: ObjectId;
  receiver_id: ObjectId;
  created_at?: Date;
  updated_at?: Date;
  content: string;
};
export default class Conversations {
  _id?: ObjectId;
  sender_id: ObjectId;
  receiver_id: ObjectId;
  created_at: Date;
  updated_at: Date;
  content: string;

  constructor(conversation: IConversationsType) {
    const date = new Date();
    this._id = conversation._id || new ObjectId();
    this.sender_id = conversation.sender_id;
    this.receiver_id = conversation.receiver_id;
    this.content = conversation.content;
    this.created_at = conversation.created_at ?? date;
    this.updated_at = conversation.updated_at ?? date;
  }
}
