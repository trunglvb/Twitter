import { HttpStatusCode } from '@/constants/enums';
import { ErrorWithStatus } from '@/utils/errors';
import { error } from 'console';
import express from 'express';
import { ContextRunner } from 'express-validator';

// can be reused by many routes
const validate = (validations: ContextRunner[]) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // sequential processing, stops running validations chain if one fails.
    for (const validation of validations) {
      const errors = await validation.run(req);
      const errorObject = errors.mapped();
      for (let key in errorObject) {
        const msg = errorObject[key].msg; // moi message la mot object vi du email: {...}, name: {...}
        if (msg instanceof ErrorWithStatus && msg.status !== HttpStatusCode.UnprocessableEntity) {
          return next(msg); // => next den file index.ts, su dung app.use
        }
      }
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errorObject });
      }
    }
  };
};

export default validate;
