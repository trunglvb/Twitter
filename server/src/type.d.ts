// mo rong kieu du lieu
import User from '@/models/schemas/users.schema';
import { express } from 'express';

//mo reong request
declare module 'express' {
  interface Request {
    user?: User;
  }
}
