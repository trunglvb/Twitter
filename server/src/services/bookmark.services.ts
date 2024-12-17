import Bookmarks from '@/models/schemas/bookmark.schema';
import databaseService from '@/services/database.services';
import { ObjectId } from 'mongodb';

interface ICreateBookmarkPayload {
  user_id: string;
  tweet_id: string;
}

class BookmarkService {
  createBookmark = async (payload: ICreateBookmarkPayload) => {
    const { user_id, tweet_id } = payload;
    const result = await databaseService.bookmark.insertOne(
      new Bookmarks({
        user_id: new ObjectId(user_id),
        tweet_id: new ObjectId(tweet_id)
      })
    );
    return result;
  };
}

const bookmarkService = new BookmarkService();
export default bookmarkService;
