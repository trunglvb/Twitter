import { ETweetAudience, ETweetType } from '@/constants/enums';
import { IMedia } from '@/models/types/media.types';
import { ObjectId } from 'mongodb';

interface ITweetType {
  //define giong nhu dang body gui len
  _id?: ObjectId;
  user_id: ObjectId;
  type: ETweetType; // loại tweet
  audience: ETweetAudience; //tính riêng tư của tweet
  content: string;
  parent_id: null | string; // chỉ null khi tweet gốc
  hashtags: ObjectId[];
  mentions: string[];
  medias: IMedia[];
  guest_views?: number;
  user_views?: number;
  created_at?: Date;
  updated_at?: Date;
}

export default class Tweets {
  //define kieu du lieu trong db
  _id?: ObjectId;
  user_id: ObjectId;
  type: ETweetType;
  audience: ETweetAudience;
  content: string;
  parent_id: null | ObjectId; // chỉ null khi tweet gốc
  hashtags: ObjectId[];
  mentions: ObjectId[];
  medias: IMedia[];
  guest_views: number;
  user_views: number;
  created_at: Date;
  updated_at: Date;

  constructor(tweet: ITweetType) {
    const initDate = new Date();
    this._id = tweet._id;
    this.user_id = tweet.user_id;
    this.type = tweet.type;
    this.audience = tweet.audience;
    this.content = tweet.content;
    this.parent_id = tweet.parent_id ? new ObjectId(tweet.parent_id!) : null;
    this.hashtags = tweet.hashtags;
    this.mentions = tweet.mentions?.map((item) => new ObjectId(item));
    this.medias = tweet.medias;
    this.guest_views = tweet.guest_views ?? 0;
    this.user_views = tweet.user_views ?? 0;
    this.created_at = tweet.created_at ?? initDate;
    this.updated_at = tweet.updated_at ?? initDate;
  }
}
