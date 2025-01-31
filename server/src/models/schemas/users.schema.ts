import { EUserVerifyStatus } from '@/constants/enums';
import { ObjectId } from 'mongodb';

interface IUserType {
  _id?: ObjectId;
  name?: string;
  email: string;
  date_of_birth: Date;
  password: string;
  created_at?: Date;
  updated_at?: Date;
  email_verify_token?: string; //jwt hoac "" neu da xac thuc
  forgot_password_token?: string; //jwt hoac "" neu da xac thuc
  verify?: EUserVerifyStatus;
  filePath?: string;
  tweeter_circle?: ObjectId[]; // danh sach nguoi co the xem bai viet

  //optional
  bio?: string;
  location?: string;
  website?: string;
  username?: string;
  avatar?: string;
  cover_photo?: string;
}
export default class User {
  _id?: ObjectId;
  name: string;
  email: string;
  date_of_birth: Date;
  password: string;
  created_at: Date;
  updated_at: Date;
  email_verify_token: string;
  forgot_password_token: string;
  verify: EUserVerifyStatus;
  filePath: string;
  bio: string;
  location: string;
  website: string;
  username: string;
  avatar: string;
  cover_photo: string;
  tweeter_circle: ObjectId[];

  constructor(user: IUserType) {
    const initDate = new Date();
    this._id = user._id;
    this.name = user.name ?? '';
    this.email = user.email;
    this.date_of_birth = user.date_of_birth;
    this.password = user.password;
    this.created_at = user.created_at ?? initDate;
    this.updated_at = user.updated_at ?? initDate;
    this.email_verify_token = user.email_verify_token ?? '';
    this.forgot_password_token = user.forgot_password_token ?? '';
    this.verify = user.verify ?? EUserVerifyStatus.Unverified;
    this.filePath = user.filePath ?? '';
    this.bio = user.bio ?? '';
    this.location = user.location ?? '';
    this.website = user.website ?? '';
    this.username = user.username ?? '';
    this.avatar = user.avatar ?? '';
    this.cover_photo = user.cover_photo ?? '';
    this.tweeter_circle = user.tweeter_circle ?? [];
  }
}
