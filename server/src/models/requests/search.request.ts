import { MediaType } from '@/constants/enums';
import { IGetNewFeedsBody } from '@/models/requests/tweet.request';

export interface ISearchQuery extends IGetNewFeedsBody {
  content: string;
  media_type?: MediaType;
  people_follow?: string;
}
