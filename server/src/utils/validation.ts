import { HttpStatusCode } from '@/constants/enums';
import { EntityError, ErrorResponse, ErrorWithStatus } from '@/utils/errors';
import express from 'express';
import { validationResult } from 'express-validator';

// can be reused by many routes
const validate = (validations: any) => {
  return async (req: express.Request, _res: express.Response, next: express.NextFunction) => {
    await validations.run(req);

    // lấy tất cả các lỗi sau khi chạy xong validations
    const errors = validationResult(req);
    const errorObject = errors.mapped();

    // khong co loi thi chay tiep
    if (errors.isEmpty()) {
      return next();
    }
    const entityError = new EntityError({ errors: {} });
    for (const key in errorObject) {
      const msg = errorObject[key].msg;
      //neu loi khac 422, next den loi do
      if (msg instanceof ErrorWithStatus && msg.status !== HttpStatusCode.UnprocessableEntity) {
        return next(msg); //next den file index.ts, su dung app.use, msg se la tham so err trong callback (err, req, res, next)
      }
      //entity error co message va status default khi tao class la 422
      entityError.errors[key] = errorObject[key] as ErrorResponse;
    }
    next(entityError);
  };
};

export default validate;
