import { ICreateTweetBody, IGetTweetChilrenBody } from '@/models/requests/tweet.request';
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
    const tweet = await databaseService.tweets.findOne({ _id: result.insertedId });
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
          guest_views: 1,
          updated_at: 1
        }
      }
    );
    return result as WithId<{ user_views: number; guest_views: number; _id: ObjectId; updated_at: Date }>;
  };

  getTweetChildren = async (payload: IGetTweetChilrenBody) => {
    const { tweet_id, user_id, type, limit, page } = payload;
    const inc = user_id ? { user_views: 1 } : { guest_views: 1 };
    const date = new Date();
    const tweets = await databaseService.tweets
      .aggregate<Tweets>([
        {
          $match: {
            parent_id: new ObjectId(tweet_id),
            type: type
          }
        },
        {
          $lookup: {
            from: 'hashtags',
            localField: 'hashtags',
            foreignField: '_id',
            as: 'hashtags'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'mentions',
            foreignField: '_id',
            as: 'mentions'
          }
        },
        {
          $addFields: {
            mentions: {
              $map: {
                input: '$mentions',
                as: 'mention',
                in: {
                  _id: '$$mention._id',
                  name: '$$mention.name',
                  email: '$$mention.email',
                  username: '$$mention.username'
                }
              }
            }
          }
        },
        {
          $skip: limit * (page - 1)
        },
        {
          $limit: limit
        }
      ])
      .toArray();
    const ids = tweets.map((tweet) => tweet._id as ObjectId);
    await databaseService.tweets.updateMany(
      {
        _id: {
          $in: ids // tim nhung tweet co id thuoc ids
        }
      },
      {
        //increase
        $inc: inc,
        $set: {
          updated_at: date
        }
      }
    );
    tweets.forEach((tweet) => {
      tweet.updated_at = date;
      if (user_id) {
        tweet.user_views++;
      } else {
        tweet.guest_views++;
      }
    });
    const totalCount = await databaseService.tweets.countDocuments({
      parent_id: new ObjectId(tweet_id),
      type: type
    });
    return { result: tweets, totalCount };
  };
}

const tweetServices = new TweetService();

export default tweetServices;
