// mo rong kieu du lieu
import { ITokenPayload } from '@/models/requests/user.request';
import User from '@/models/schemas/users.schema';
import { express } from 'express';

//mo reong request
declare module 'express' {
  interface Request {
    user?: User;
    decode_refresh_token?: ITokenPayload;
    decode_email_verify_token?: ITokenPayload;
    decode_access_token?: ITokenPayload;
  }
}
