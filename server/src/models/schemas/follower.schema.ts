import { ObjectId } from 'mongodb';

type IFollowerType = {
  _id?: ObjectId;
  user_id: ObjectId;
  created_at?: Date;
  followed_user_id: ObjectId;
};

export default class Followers {
  _id?: ObjectId;
  user_id: ObjectId;
  created_at?: Date;
  followed_user_id: ObjectId;

  constructor(follower: IFollowerType) {
    this._id = follower._id;
    this.user_id = follower.user_id;
    this.created_at = follower.created_at ?? new Date();
    this.followed_user_id = follower.followed_user_id;
  }
}
