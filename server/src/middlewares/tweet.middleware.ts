import { ETweetAudience, ETweetType, EUserVerifyStatus, HttpStatusCode } from '@/constants/enums';
import { ICreateTweetBody } from '@/models/requests/tweet.request';
import Tweets from '@/models/schemas/tweets.schems';
import databaseService from '@/services/database.services';
import { enumToArray, isMediaCheck } from '@/utils/common';
import { ErrorWithStatus } from '@/utils/errors';
import validate from '@/utils/validation';
import { Request, Response, NextFunction } from 'express';
import { checkSchema } from 'express-validator';
import { isEmpty } from 'lodash';
import { ObjectId } from 'mongodb';

export const createSchemaValidator = validate(
  checkSchema(
    {
      type: {
        custom: {
          options: (value) => {
            if (!Array.isArray(value) && enumToArray(ETweetType).includes(value)) {
              return true;
            }
            throw new Error('Invalid type');
          }
        }
      },
      audience: {
        custom: {
          options: (value) => {
            if (!Array.isArray(value) && enumToArray(ETweetAudience).includes(value)) {
              return true;
            }
            throw new Error('Invalid audience');
          }
        }
      },
      parent_id: {
        custom: {
          options: (value, { req }) => {
            const body = req.body as ICreateTweetBody;
            const type = body.type;
            if (
              [ETweetType.Comment, ETweetType.QuoteTweet, ETweetType.Retweet].includes(type) &&
              !ObjectId.isValid(value)
            ) {
              throw new Error('Parent_id must be a valid tweet_id');
            }
            if (type === ETweetType.Tweet && value !== null) {
              throw new Error('Parent_id must be null');
            }
            return true;
          }
        }
      },
      content: {
        isString: true,
        custom: {
          options: (value, { req }) => {
            const body = req.body as ICreateTweetBody;
            const { type, hashtags, mentions } = body;
            if (type === ETweetType.Retweet && value !== '') {
              throw new Error('Content must be empty string');
            }
            if (
              [ETweetType.Comment, ETweetType.QuoteTweet, ETweetType.Tweet].includes(type) &&
              isEmpty(hashtags) &&
              isEmpty(mentions) &&
              value === ''
            ) {
              throw new Error('Content must be non-empty string');
            }
            return true;
          }
        }
      },
      hashtags: {
        isArray: true,
        custom: {
          options: (value, { req }) => {
            if ((value as Array<any>).some((item) => typeof item !== 'string')) {
              throw new Error('Hashtag must be string');
            }
            return true;
          }
        }
      },
      mentions: {
        isArray: true,
        custom: {
          options: (value, { req }) => {
            if ((value as Array<any>).some((item) => !ObjectId.isValid(item))) {
              throw new Error('mention must be valid user id');
            }
            return true;
          }
        }
      },
      medias: {
        //yeu cau moi phan tu la media object
        isArray: true,
        custom: {
          options: (value, { req }) => {
            if (!Array.isArray(value) && !value.some(isMediaCheck)) {
              throw new Error('Medias is invalid');
            }
            return true;
          }
        }
      }
    },
    ['body']
  )
);

export const tweetIdValidator = validate(
  checkSchema(
    {
      tweet_id: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatus({
                status: HttpStatusCode.NotFound,
                message: 'Tweet id is invalid'
              });
            }
            const [tweet] = await databaseService.tweets
              .aggregate<Tweets>([
                {
                  $match: {
                    _id: new ObjectId(value)
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
                    tweet_childrens: 0
                  }
                }
              ])
              .toArray();

            req.tweet = tweet;
            if (tweet == null) {
              throw new ErrorWithStatus({
                message: 'Tweet not found',
                status: HttpStatusCode.NotFound
              });
            }
            return true;
          }
        }
      }
    },
    ['params', 'body']
  )
);

export const isUserLoginedValidator = (middleWareFunc: (req: Request, res: Response, next: NextFunction) => void) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
      return middleWareFunc(req, res, next);
    }
    next();
  };
};

//muốn dùng async trong handler express thì phải có trycatch mới có thể bắt được lỗi không thì phải dùng wrap => nêú không có sẽ crash app
export const audienceValidator = async (req: Request, res: Response, next: NextFunction) => {
  const tweet = req.tweet!;
  const audienceType = tweet?.audience;
  if (audienceType === ETweetAudience.TweeterCircle) {
    //kiem tra nguoi xem tweet nay da dang nhap hay chua
    if (!req.decode_access_token) {
      throw new ErrorWithStatus({
        status: HttpStatusCode.Unauthorized,
        message: 'Access token is require'
      });
    }
    const user_id = req.decode_access_token?.user_id;
    //kiem tra tai khoan tac gia có bị khoá hay bị cấm không
    const author = await databaseService.users.findOne({
      _id: new ObjectId(tweet.user_id)
    });
    if (!author || author.verify === EUserVerifyStatus.Banned) {
      throw new ErrorWithStatus({
        status: HttpStatusCode.NotFound,
        message: 'User not found'
      });
    }
    //kiem tra nguoi xem tweet nay co trong Tweet_circle cua tac gia khong
    //hoac co phai tac gia hay khong
    const isInTweeterCircle = author?.tweeter_circle.some((id) => id.equals(user_id));
    if (!author._id.equals(user_id) && !isInTweeterCircle) {
      throw new ErrorWithStatus({
        status: HttpStatusCode.Forbidden,
        message: 'Tweet is not publish'
      });
    }
  }
  next();
};

export const paginationValidator = validate(
  checkSchema(
    {
      limit: {
        isNumeric: true,
        custom: {
          options: async (value) => {
            const num = Number(value);
            if (num < 1 || num > 100) {
              throw new Error('1 <= limit <= 100');
            }
            return true;
          }
        }
      },
      page: {
        isNumeric: true,
        custom: {
          options: async (value) => {
            const num = Number(value);
            if (num < 1) {
              throw new Error('Page must be >= 1');
            }
            return true;
          }
        }
      }
    },
    ['body']
  )
);

export const getTweetChildrenValidator = validate(
  checkSchema(
    {
      type: {
        isIn: {
          options: [ETweetType],
          errorMessage: 'Tweet type is invalid'
        }
      }
    },
    ['body']
  )
);
