import { ICreateTweetBody } from '@/models/requests/tweet.request';
import Tweets from '@/models/schemas/tweets.schems';
import databaseService from '@/services/database.services';
import { ObjectId } from 'mongodb';

interface ICreateTweetPayload {
  body: ICreateTweetBody;
  user_id: string;
}
class TweetService {
  create = async (payload: ICreateTweetPayload) => {
    const { body, user_id } = payload;
    const result = await databaseService.tweets.insertOne(
      new Tweets({
        type: body.type,
        audience: body.audience,
        content: body.content,
        hashtags: [], //wait
        mentions: body.mentions,
        medias: body.medias,
        parent_id: body.parent_id,
        user_id: new ObjectId(user_id)
      })
    );
    const tweet = databaseService.tweets.findOne({ _id: result.insertedId });
    return tweet;
  };
}

const tweetServices = new TweetService();

export default tweetServices;
