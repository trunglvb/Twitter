import { ETweetAudience, ETweetType, HttpStatusCode } from '@/constants/enums';
import { ICreateTweetBody } from '@/models/requests/tweet.request';
import databaseService from '@/services/database.services';
import { enumToArray } from '@/utils/common';
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
        isIn: {
          options: enumToArray(ETweetType),
          errorMessage: 'Invalid type'
        }
      },
      audience: {
        isIn: {
          options: enumToArray(ETweetAudience),
          errorMessage: 'Invalid audience'
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
      }
    },
    ['body']
  )
);
