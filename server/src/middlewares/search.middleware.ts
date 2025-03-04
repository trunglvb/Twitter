import { EPeopleFollow } from '@/constants/enums';
import validate from '@/utils/validation';
import { Request, Response, NextFunction } from 'express';
import { checkSchema } from 'express-validator';

export const searchValidator = validate(
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
      },
      content: {
        isString: {
          errorMessage: 'Content must be string'
        }
      },
      people_follow: {
        optional: true,
        isIn: {
          options: [[EPeopleFollow.No, EPeopleFollow.Yes]],
          errorMessage: 'People follow must be 0 or 1'
        }
      }
    },
    ['query']
  )
);

export default searchValidator;
