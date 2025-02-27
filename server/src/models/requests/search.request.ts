import { IGetNewFeedsBody } from '@/models/requests/tweet.request';
import { ParsedQs } from 'qs';

export interface ISearchQuery extends IGetNewFeedsBody {
  content: string;
}
