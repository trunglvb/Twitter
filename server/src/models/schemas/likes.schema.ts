import { ObjectId } from 'mongodb';

type ILikesType = {
  _id?: ObjectId;
  user_id: ObjectId;
  tweet_id: ObjectId;
  created_at?: Date;
};
export default class Likes {
  _id?: ObjectId;
  user_id: ObjectId;
  tweet_id: ObjectId;
  created_at: Date;

  constructor(like: ILikesType) {
    this._id = like._id || new ObjectId();
    this.user_id = like.user_id;
    this.tweet_id = like.tweet_id;
    this.created_at = like.created_at ?? new Date();
  }
}
