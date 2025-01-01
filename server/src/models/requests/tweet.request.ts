import { ETweetAudience, ETweetType } from '@/constants/enums';
import { IMedia } from '@/models/types/media.types';

export type ICreateTweetBody = {
  type: ETweetType;
  audience: ETweetAudience;
  content: string;
  parent_id: null | string; // chỉ null khi tweet gốc, không thì là tweet_id.
  hashtags: string[]; // tên của hashtag dạng ['aaa', 'reabbbctjs']
  mentions: string[]; // user_id[]
  medias: IMedia[];
};

export type IGetTweetChilrenBody = {
  tweet_id: string;
  type: ETweetType;
  page: number;
  limit: number;
};
