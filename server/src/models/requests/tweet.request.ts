import { ETweetAudience, ETweetType } from '@/constants/enums';
import { MediaType } from 'express';

export type ICreateTweetBody = {
  type: ETweetType;
  audience: ETweetAudience;
  content: string;
  parent_id: null | string; // chỉ null khi tweet gốc, không thì là tweet_id.
  hashtags: string[]; // tên của hashtag dạng ['aaa', 'reabbbctjs']
  mentions: string[]; // user_id[]
  medias: MediaType[];
};
