import { ETweetAudience, ETweetType } from '@/constants/enums';
import { ISearchQuery } from '@/models/requests/search.request';
import Tweets from '@/models/schemas/tweets.schems';
import databaseService from '@/services/database.services';
import { ObjectId } from 'mongodb';

class SearchService {
  search = async (payload: ISearchQuery) => {
    const { page, limit, content, user_id } = payload;
    const inc = { user_views: 1 };
    const date = new Date();
    const result = await databaseService.tweets
      .aggregate<Tweets>([
        {
          $match: {
            $text: {
              $search: content
            }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $match: {
            $or: [
              {
                audience: ETweetAudience.Everyone
              },
              {
                $and: [
                  {
                    audience: ETweetAudience.TweeterCircle
                  },
                  {
                    'user.tweeter_circle': {
                      $in: [new ObjectId(user_id)]
                    }
                  }
                ]
              }
            ]
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
                  username: '$$mention.username',
                  email: '$$mention.email'
                }
              }
            }
          }
        },
        {
          $lookup: {
            from: 'likes',
            localField: '_id',
            foreignField: 'tweet_id',
            as: 'likes'
          }
        },
        {
          $lookup: {
            from: 'bookmarks',
            localField: '_id',
            foreignField: 'tweet_id',
            as: 'bookmarks'
          }
        },
        {
          $lookup: {
            from: 'tweets',
            localField: '_id',
            foreignField: 'parent_id',
            as: 'tweet_childrens'
          }
        },
        {
          $addFields: {
            bookmarks: {
              $size: '$bookmarks'
            },
            likes: {
              $size: '$likes'
            },
            retweet_count: {
              $size: {
                $filter: {
                  input: '$tweet_childrens',
                  as: 'item',
                  cond: {
                    $eq: ['$$item.type', ETweetType.Retweet]
                  }
                }
              }
            },
            comment_count: {
              $size: {
                $filter: {
                  input: '$tweet_childrens',
                  as: 'item',
                  cond: {
                    $eq: ['$$item.type', ETweetType.Comment]
                  }
                }
              }
            },
            quoteTweet_count: {
              $size: {
                $filter: {
                  input: '$tweet_childrens',
                  as: 'item',
                  cond: {
                    $eq: ['$$item.type', ETweetType.QuoteTweet]
                  }
                }
              }
            },
            views: {
              $add: ['$user_views', '$guest_views']
            }
          }
        },
        {
          $project: {
            tweet_childrens: 0,
            user: {
              password: 0,
              email_verify_token: 0,
              forgot_password_token: 0,
              tweeter_circle: 0
            }
          }
        },
        {
          $unwind: {
            path: '$user'
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
    const tweet_ids = result?.map((i) => i._id as ObjectId);
    await databaseService.tweets.updateMany(
      {
        _id: {
          $in: tweet_ids
        }
      },
      {
        $inc: inc,
        $set: {
          updated_at: date
        }
      }
    );
    result.forEach((tweet) => {
      tweet.updated_at = date;
      tweet.user_views++;
    });
    return result;
  };

  searchByHashtags = async (payload: ISearchQuery) => {
    const { page, limit, content, user_id } = payload;
    const inc = { user_views: 1 };
    const date = new Date();

    const result = (await databaseService.hashtag
      .aggregate([
        {
          $match: {
            $text: {
              $search: content
            }
          }
        },
        {
          $lookup: {
            from: 'tweets',
            localField: '_id',
            foreignField: 'hashtags',
            as: 'tweet'
          }
        },
        {
          $unwind: {
            path: '$tweet'
          }
        },
        {
          $replaceRoot: {
            newRoot: '$tweet'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $match: {
            $or: [
              {
                audience: ETweetAudience.Everyone
              },
              {
                $and: [
                  {
                    audience: ETweetAudience.TweeterCircle
                  },
                  {
                    'user.tweeter_circle': {
                      $in: [new ObjectId(user_id)]
                    }
                  }
                ]
              }
            ]
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
                  username: '$$mention.username',
                  email: '$$mention.email'
                }
              }
            }
          }
        },
        {
          $lookup: {
            from: 'likes',
            localField: '_id',
            foreignField: 'tweet_id',
            as: 'likes'
          }
        },
        {
          $lookup: {
            from: 'bookmarks',
            localField: '_id',
            foreignField: 'tweet_id',
            as: 'bookmarks'
          }
        },
        {
          $lookup: {
            from: 'tweets',
            localField: '_id',
            foreignField: 'parent_id',
            as: 'tweet_childrens'
          }
        },
        {
          $addFields: {
            bookmarks: {
              $size: '$bookmarks'
            },
            likes: {
              $size: '$likes'
            },
            retweet_count: {
              $size: {
                $filter: {
                  input: '$tweet_childrens',
                  as: 'item',
                  cond: {
                    $eq: ['$$item.type', ETweetType.Retweet]
                  }
                }
              }
            },
            comment_count: {
              $size: {
                $filter: {
                  input: '$tweet_childrens',
                  as: 'item',
                  cond: {
                    $eq: ['$$item.type', ETweetType.Comment]
                  }
                }
              }
            },
            quoteTweet_count: {
              $size: {
                $filter: {
                  input: '$tweet_childrens',
                  as: 'item',
                  cond: {
                    $eq: ['$$item.type', ETweetType.QuoteTweet]
                  }
                }
              }
            },
            views: {
              $add: ['$user_views', '$guest_views']
            }
          }
        },
        {
          $project: {
            tweet_childrens: 0,
            user: {
              password: 0,
              email_verify_token: 0,
              forgot_password_token: 0,
              tweeter_circle: 0
            }
          }
        },
        {
          $unwind: {
            path: '$user'
          }
        },
        {
          $skip: limit * (page - 1)
        },
        {
          $limit: limit
        }
      ])
      .toArray()) as Tweets[];

    const tweet_ids = result?.map((i) => i._id as ObjectId);
    await databaseService.tweets.updateMany(
      {
        _id: {
          $in: tweet_ids
        }
      },
      {
        $inc: inc,
        $set: {
          updated_at: date
        }
      }
    );
    result.forEach((tweet) => {
      tweet.updated_at = date;
      tweet.user_views++;
    });
    return result;
  };
}

const searchService = new SearchService();
export default searchService;
