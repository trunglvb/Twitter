import { ObjectId } from 'mongodb';

type IHashtagType = {
  _id?: ObjectId;
  name: string;
  created_at?: Date;
};
export default class Hashtags {
  _id?: ObjectId;
  name: string;
  created_at: Date;

  constructor(hastag: IHashtagType) {
    this._id = hastag._id || new ObjectId();
    this.name = hastag.name;
    this.created_at = hastag.created_at ?? new Date();
  }
}
