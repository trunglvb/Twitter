import { ICreateTweetBody } from '@/models/requests/tweet.request';
import Hashtags from '@/models/schemas/hashtag.schema';
import Tweets from '@/models/schemas/tweets.schems';
import databaseService from '@/services/database.services';
import { ObjectId, WithId } from 'mongodb';

interface ICreateTweetPayload {
  body: ICreateTweetBody;
  user_id: string;
}
class TweetService {
  checkAndCreateHashtags = async (hashtags: string[]) => {
    const hashtagDocument = await Promise.all(
      hashtags.map((hashtag) => {
        return databaseService.hashtag.findOneAndUpdate(
          {
            name: hashtag
          },
          {
            $setOnInsert: new Hashtags({ name: hashtag })
          },
          {
            upsert: true,
            returnDocument: 'after'
          }
        );
      })
    );
    return hashtagDocument?.map((i) => i?._id);
  };

  create = async (payload: ICreateTweetPayload) => {
    const { body, user_id } = payload;
    const hashtagIds = await this.checkAndCreateHashtags(body.hashtags);
    const result = await databaseService.tweets.insertOne(
      new Tweets({
        type: body.type,
        audience: body.audience,
        content: body.content,
        hashtags: hashtagIds as ObjectId[], //wait
        mentions: body.mentions,
        medias: body.medias,
        parent_id: body.parent_id,
        user_id: new ObjectId(user_id)
      })
    );
    const tweet = databaseService.tweets.findOne({ _id: result.insertedId });
    return tweet;
  };

  increaseView = async (tweet_id: string, user_id: string) => {
    const inc = user_id ? { user_views: 1 } : { guest_views: 1 };
    const result = await databaseService.tweets.findOneAndUpdate(
      {
        _id: new ObjectId(tweet_id)
      },
      {
        //increase
        $inc: inc,
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after',
        projection: {
          user_views: 1,
          guest_views: 1
        }
      }
    );
    return result as WithId<{ user_views: number; guest_views: number; _id: ObjectId }>;
  };
}

const tweetServices = new TweetService();

export default tweetServices;
