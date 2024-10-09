import { HttpStatusCode } from '@/constants/enums';
import { EntityError, ErrorResponse, ErrorWithStatus } from '@/utils/errors';
import express from 'express';
import { ContextRunner, validationResult } from 'express-validator';

// can be reused by many routes
const validate = (validations: any) => {
  return async (req: express.Request, _res: express.Response, next: express.NextFunction) => {
    const entityError = new EntityError({ errors: {} });
    // Chạy tuần tự tất cả các validations
    for (const validation of validations) {
      await validation.run(req);
    }
    // lấy tất cả các lỗi sau khi chạy xong tất cả validations
    const errors = validationResult(req);
    const errorObject = errors.mapped();
    for (let key in errorObject) {
      const msg = errorObject[key].msg;
      if (msg instanceof ErrorWithStatus && msg.status !== HttpStatusCode.UnprocessableEntity) {
        return next(errorObject); //next den file index.ts, su dung app.use, msg se la tham so err trong callback (err, req, res, next)
      }
      entityError.errors[key] = errorObject[key] as ErrorResponse;
    }
    if (!errors.isEmpty()) {
      return next(entityError);
    }
    next();
  };
};

export default validate;
