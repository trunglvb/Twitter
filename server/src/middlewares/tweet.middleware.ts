import { ETweetAudience, ETweetType, HttpStatusCode } from '@/constants/enums';
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
