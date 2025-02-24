import { ISearchQuery } from '@/models/requests/search.request';
import databaseService from '@/services/database.services';

class SearchService {
  search = async (payload: ISearchQuery) => {
    const { page, limit, content } = payload;
    console.log('content', content);
    const result = await databaseService.tweets
      .find({
        $text: {
          $search: content
        }
      })
      .skip(limit * (page - 1))
      .limit(limit)
      .toArray();
    return result;
  };
}

const searchService = new SearchService();
export default searchService;
