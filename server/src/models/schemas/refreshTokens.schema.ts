import { ObjectId } from 'mongodb';

type IRefreshTokenType = {
  _id?: ObjectId;
  token: string;
  created_at?: Date;
  user_id: ObjectId;
};

export default class RefreshTokens {
  _id?: ObjectId;
  token: string;
  created_at?: Date;
  user_id: ObjectId;

  constructor(refreshToken: IRefreshTokenType) {
    this._id = refreshToken._id;
    this.token = refreshToken.token ?? '';
    this.created_at = refreshToken.created_at ?? new Date();
    this.user_id = refreshToken.user_id;
  }
}
