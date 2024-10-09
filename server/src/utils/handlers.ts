import { Request, Response, NextFunction, RequestHandler } from 'express';

// wrap de khong can try catch trong controller
const wrapRequestHandler = (func: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export { wrapRequestHandler };
