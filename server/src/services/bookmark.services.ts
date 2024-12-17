interface ICreateBookmarkPayload {
  user_id: string;
  tweet_id: string;
}

class BookmarkService {
  createBookmark = async (payload: ICreateBookmarkPayload) => {
    const { user_id, tweet_id } = payload;
    return 'done';
  };
}

const bookmarkService = new BookmarkService();
export default bookmarkService;
