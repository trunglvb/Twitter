import { ETweetAudience, ETweetType, EUserVerifyStatus, HttpStatusCode } from '@/constants/enums';
import { ICreateTweetBody } from '@/models/requests/tweet.request';
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
            const tweet = await databaseService.tweets.findOne({
              _id: new ObjectId(value)
            });
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

//muốn dùng async trong handler express thì phải có trycatch không thì phải dùng wrap
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
      _id: new ObjectId(tweet._id)
    });
    if (!author || author.verify === EUserVerifyStatus.Banned) {
      throw new ErrorWithStatus({
        status: HttpStatusCode.NotFound,
        message: 'User not found'
      });
    }
    //kiem tra nguoi xem tweet nay co trong Tweet_circle cua tac gia khong
    const isInTweeterCircle = author?.tweeter_circle.some((id) => id.equals(req.decode_access_token?.user_id));
    if (!isInTweeterCircle || !author._id.equals(user_id)) {
      throw new ErrorWithStatus({
        status: HttpStatusCode.Forbidden,
        message: 'Tweet is not publish'
      });
    }
  }
  next();
};
