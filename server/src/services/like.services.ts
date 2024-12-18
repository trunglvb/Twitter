import Likes from '@/models/schemas/likes.schema';
import databaseService from '@/services/database.services';
import { ObjectId } from 'mongodb';

interface ICreateLikePayload {
  user_id: string;
  tweet_id: string;
}

class LikeService {
  createLike = async (payload: ICreateLikePayload) => {
    const { user_id, tweet_id } = payload;
    const result = await databaseService.likes.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id),
        tweet_id: new ObjectId(tweet_id)
      },
      {
        $setOnInsert: new Likes({
          user_id: new ObjectId(user_id),
          tweet_id: new ObjectId(tweet_id)
        })
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    );
    return result;
  };

  unLike = async (payload: ICreateLikePayload) => {
    const { user_id, tweet_id } = payload;
    const result = await databaseService.likes.findOneAndDelete({
      user_id: new ObjectId(user_id),
      tweet_id: new ObjectId(tweet_id)
    });
    return result;
  };
}

const likesService = new LikeService();
export default likesService;
