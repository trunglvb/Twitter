import { IGetNewFeedsBody } from '@/models/requests/tweet.request';

export interface ISearchQuery extends IGetNewFeedsBody {
  content: string;
}
