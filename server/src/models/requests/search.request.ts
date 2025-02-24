import { IGetNewFeedsBody } from '@/models/requests/tweet.request';

export interface ISearchQuery extends Pick<IGetNewFeedsBody, 'limit' | 'page'> {
  content: string;
}
